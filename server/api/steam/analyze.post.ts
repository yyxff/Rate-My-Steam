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

  try {
    // Call Gemini AI analysis with optional prompt ID
    const analysis = await analyzeGamesWithGemini(body, promptId)
    
    return {
      success: true,
      analysis,
      promptId: promptId || 'default'
    }
  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to analyze with AI'
    })
  }
})
