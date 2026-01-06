import { GoogleGenAI } from '@google/genai'
import { getActivePrompt, getPromptById } from './prompts'

/**
 * Analyze Steam gaming data using Gemini AI
 * @param steamData - Steam player data including games, stats, and player info
 * @param promptId - Optional prompt template ID (defaults to active prompt)
 * @param language - Optional language for response ('en' or 'zh')
 * @returns AI analysis result or null if failed
 */
export async function analyzeGamesWithGemini(steamData: any, promptId?: string, language?: string) {
  const config = useRuntimeConfig()
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.warn('Gemini API key is not configured')
    return null
  }

  try {
    const client = new GoogleGenAI({ apiKey })

    // Determine which prompt to use based on language
    // If no promptId specified, default to 'fun' in Chinese or 'fun-en' in English
    let effectivePromptId = promptId
    
    if (!effectivePromptId) {
      effectivePromptId = language === 'en' ? 'fun-en' : 'fun'
    } else if (language === 'en' && effectivePromptId === 'fun') {
      // If user selected 'fun' but language is English, use the English version
      effectivePromptId = 'fun-en'
    }

    const promptTemplate = getPromptById(effectivePromptId)
    const prompt = promptTemplate.template(steamData)
    console.log(prompt)
    
    console.log(`Sending data to Gemini AI using prompt: ${promptTemplate.name} (${language})`)
    
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt
    })

    const analysis = response.text

    console.log('=== Gemini AI Analysis ===')
    console.log(analysis)

    return analysis
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    return null
  }
}
