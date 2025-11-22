import { GoogleGenAI } from '@google/genai'
import { getActivePrompt, getPromptById } from './prompts'

/**
 * Analyze Steam gaming data using Gemini AI
 * @param steamData - Steam player data including games, stats, and player info
 * @param promptId - Optional prompt template ID (defaults to active prompt)
 * @returns AI analysis result or null if failed
 */
export async function analyzeGamesWithGemini(steamData: any, promptId?: string) {
  const config = useRuntimeConfig()
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.warn('Gemini API key is not configured')
    return null
  }

  try {
    const client = new GoogleGenAI({ apiKey })

    // Get the prompt template (use specified ID or default active prompt)
    const promptTemplate = promptId ? getPromptById(promptId) : getActivePrompt()
    const prompt = promptTemplate.template(steamData)

    console.log(`Sending data to Gemini AI using prompt: ${promptTemplate.name}`)
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
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
