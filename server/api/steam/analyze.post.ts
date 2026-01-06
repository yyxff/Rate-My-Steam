export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body || !body.player || !body.stats || !body.games) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body. Steam data is required.'
    })
  }

  // Optional: Get prompt ID from query params
  const query = getQuery(event)
  const promptId = query.promptId as string | undefined
  
  // Extract language from body
  const language = body._language || 'en'
  
  // Remove language from body before passing to Gemini
  const { _language, ...steamData } = body

  try {
    // Call Gemini AI analysis with optional prompt ID and language
    const analysis = await analyzeGamesWithGemini(steamData, promptId, language)
    
    return {
      success: true,
      analysis,
      promptId: promptId || 'default',
      language
    }
  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to analyze with AI'
    })
  }
})
