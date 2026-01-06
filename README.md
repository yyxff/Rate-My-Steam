# Rate My Steam - Steam Library Analysis Tool

A web application that analyzes Steam players' game libraries using AI.

## Features

- 🎮 Fetch Steam player game library data
- 🧠 AI-driven player personality analysis (Gemini)
-  Gaming style analysis
- 📊 Deep data insights with radar chart visualization
- 💬 Humorous roast analysis of gaming habits
- 🔗 Shareable links

## Tech Stack

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **Backend**: Nuxt Server API
- **APIs**: 
  - Steam Web API (game data)
  - Google Gemini AI (text analysis)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

1. **Steam API Key**
   - Visit [Steam Web API Key](https://steamcommunity.com/dev/apikey)
   - Get your API Key

2. **Gemini API Key** (for AI text analysis)
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create an API Key

3. Copy `.env.example` to `.env` and add your keys:

```env
STEAM_API_KEY=your_steam_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## How to Get Steam ID

There are several ways to get a Steam ID:

1. **From Steam Profile URL**: 
   - If your URL is `steamcommunity.com/id/yourusername`, use `yourusername`
   - If it's `steamcommunity.com/profiles/76561198XXXXXXXX`, use the numeric ID

2. **Use Third-party Tools**: 
   - Visit [SteamID.io](https://steamid.io/) and enter your Steam profile link

## API Documentation

### GET `/api/steam/games`

Fetch player's game library data

**Parameters**:
- `steamId` (required): Steam player ID

**Response Example**:
```json
{
  "player": {
    "steamId": "76561198XXXXXXXX",
    "name": "PlayerName",
    "avatar": "https://...",
    "profileUrl": "https://..."
  },
  "stats": {
    "totalGames": 150,
    "totalPlaytime": 50000
  },
  "games": [
    {
      "appId": 730,
      "name": "Counter-Strike: Global Offensive",
      "playtimeForever": 5000,
      "playtimeHours": 83
    }
  ]
}
```

## Development Roadmap

- [x] Frontend interface design
- [x] Steam API integration
- [ ] AI analysis features
- [ ] Results page display
- [ ] Share functionality
- [ ] Data visualization

## License

MIT
