export interface SteamPlayer {
  steamId: string
  name: string
  avatar: string
  profileUrl: string
}

export interface SteamGame {
  appId: number
  name: string
  playtimeForever: number
  playtimeHours: number
  img_icon_url?: string
  img_logo_url?: string
}

export interface SteamStats {
  totalGames: number
  totalPlaytime: number
}

export interface SteamApiResponse {
  player: SteamPlayer
  stats: SteamStats
  games: SteamGame[]
}
