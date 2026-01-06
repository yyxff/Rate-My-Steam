import { prompts } from '../../utils/prompts'

/**
 * Get all available AI prompt templates
 * GET /api/steam/prompts
 */
export default defineEventHandler(() => {
  return {
    prompts: prompts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description
    }))
  }
})
