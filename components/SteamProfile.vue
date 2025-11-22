<template>
  <div class="steam-profile">
    <div class="steam-header">
      <h2>🎮 Steam Profile</h2>
    </div>
    
    <div class="player-info">
      <img :src="steamData.player.avatar" :alt="steamData.player.name" class="player-avatar" />
      <div class="player-details">
        <div class="player-name">{{ steamData.player.name }}</div>
        <div class="player-stats">
          {{ steamData.stats.totalGames }} games
        </div>
        <div class="player-stats">
          {{ Math.floor(steamData.stats.totalPlaytime / 60) }}h total
        </div>
      </div>
    </div>
    
    <div class="top-games">
      <h3>Top 10 Games</h3>
      <div class="games-list">
        <div 
          v-for="(game, index) in sortedGames.slice(0, 10)" 
          :key="game.appId"
          class="game-item"
        >
          <div class="game-info">
            <span class="game-rank">{{ index + 1 }}</span>
            <span class="game-name" :title="game.name">{{ game.name }}</span>
            <span class="game-hours">{{ game.playtimeHours }}h</span>
          </div>
          <div class="progress-bar-container">
            <div 
              class="progress-bar" 
              :style="{ width: (game.playtimeHours / maxPlaytime * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SteamApiResponse } from '../types/steam'

interface Props {
  steamData: SteamApiResponse
}

const props = defineProps<Props>()

// Computed: Sorted games by playtime
const sortedGames = computed(() => {
  return [...props.steamData.games].sort((a, b) => b.playtimeForever - a.playtimeForever)
})

// Computed: Max playtime for progress bar
const maxPlaytime = computed(() => {
  if (!sortedGames.value.length) return 1
  return sortedGames.value[0].playtimeHours || 1
})
</script>

<style scoped>
.steam-profile {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  height: 100%;
}

.steam-header {
  margin-bottom: 1.5rem;
}

.steam-header h2 {
  font-size: 1.2rem;
  margin: 0;
  color: #e0e6ff;
  font-weight: 600;
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.player-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(124, 58, 237, 0.5);
}

.player-details {
  text-align: center;
  width: 100%;
}

.player-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e6ff;
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.player-stats {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.top-games h3 {
  font-size: 1rem;
  color: #cbd5e0;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.game-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.game-item:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(4px);
}

.game-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.game-rank {
  font-weight: 700;
  color: #667eea;
  min-width: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.game-name {
  flex: 1;
  color: #e0e6ff;
  font-size: 0.85rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-hours {
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 45px;
  text-align: right;
}

.progress-bar-container {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.8s ease-out;
}
</style>
