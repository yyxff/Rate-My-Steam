export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const steamId = query.steamId as string

  if (!steamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Steam ID is required'
    })
  }

  const apiKey = process.env.STEAM_API_KEY

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Steam API key is not configured'
    })
  }

  try {
    // fetch owned games
    const gamesResponse = await $fetch(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`,
      {
        params: {
          key: apiKey,
          steamid: steamId,
          include_appinfo: 1,
          include_played_free_games: 1,
          format: 'json'
        }
      }
    )

    // fetch player summaries
    const playerResponse = await $fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`,
      {
        params: {
          key: apiKey,
          steamids: steamId,
          format: 'json'
        }
      }
    )

    const games = (gamesResponse as any)?.response?.games || []
    const player = (playerResponse as any)?.response?.players?.[0] || null

    // log to server console
    console.log('=== Steam Player Info ===')
    console.log('Player:', player?.personaname)
    console.log('Total Games:', games.length)
    console.log('\n=== Top 10 Most Played Games ===')
    
    const sortedGames = games
      .sort((a: any, b: any) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
      .slice(0, 10)

    sortedGames.forEach((game: any, index: number) => {
      const hours = Math.floor(game.playtime_forever / 60)
      console.log(`${index + 1}. ${game.name} - ${hours} hours`)
    })

    return {
      player: {
        steamId: player?.steamid,
        name: player?.personaname,
        avatar: player?.avatarfull,
        profileUrl: player?.profileurl
      },
      stats: {
        totalGames: games.length,
        totalPlaytime: games.reduce((acc: number, game: any) => acc + (game.playtime_forever || 0), 0)
      },
      games: games.map((game: any) => ({
        appId: game.appid,
        name: game.name,
        playtimeForever: game.playtime_forever,
        playtimeHours: Math.floor(game.playtime_forever / 60),
        img_icon_url: game.img_icon_url,
        img_logo_url: game.img_logo_url
      }))
    }
  } catch (error: any) {
    console.error('Steam API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch Steam data'
    })
  }
})
