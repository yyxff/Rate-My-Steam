<template>
  <div class="app-container">
    <div class="background-grid"></div>
    <div class="glow-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    
    <main class="main-content">
      <div class="header">
        <h1 class="title">
          <span class="title-icon">🎮</span>
          RATE MY STEAM
        </h1>
        <p class="subtitle">Discover your gaming personality through AI</p>
      </div>

      <div class="input-section">
        <div class="input-wrapper">
          <input
            v-model="steamId"
            type="text"
            class="steam-input"
            placeholder="Enter Steam ID or Profile URL"
            @keyup.enter="analyzProfile"
          />
        </div>

        <!-- Prompt Selection -->
        <div class="prompt-selector" v-if="availablePrompts.length > 0">
          <label for="prompt-select">Analysis Style:</label>
          <select 
            id="prompt-select" 
            v-model="selectedPromptId" 
            class="prompt-select"
          >
            <option 
              v-for="prompt in availablePrompts" 
              :key="prompt.id" 
              :value="prompt.id"
            >
              {{ prompt.name }}
            </option>
          </select>
        </div>

        <button 
          class="analyze-btn"
          @click="analyzProfile"
          :disabled="loading || !steamId"
        >
          <span class="btn-content">
            <span v-if="!loading">Analyze Profile</span>
            <span v-else class="loading-text">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </span>
          </span>
          <div class="btn-glow"></div>
        </button>
      </div>

      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <div class="feature-text">Gaming Style</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🧠</div>
          <div class="feature-text">Personality</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <div class="feature-text">Deep Analysis</div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        ❌ {{ errorMessage }}
      </div>

      <!-- Steam Data Display -->
      <div v-if="steamData" class="results-section">
        <div class="steam-card">
          <div class="steam-header">
            <h2>🎮 Steam Profile</h2>
            <div class="player-info">
              <img :src="steamData.player.avatar" :alt="steamData.player.name" class="player-avatar" />
              <div>
                <div class="player-name">{{ steamData.player.name }}</div>
                <div class="player-stats">
                  {{ steamData.stats.totalGames }} games | 
                  {{ Math.floor(steamData.stats.totalPlaytime / 60) }} hours total
                </div>
              </div>
            </div>
          </div>
          
          <div class="top-games">
            <h3>Top 10 Most Played Games</h3>
            <div class="games-list">
              <div 
                v-for="(game, index) in steamData.games.slice(0, 10)" 
                :key="game.appId"
                class="game-item"
              >
                <span class="game-rank">{{ index + 1 }}</span>
                <span class="game-name">{{ game.name }}</span>
                <span class="game-hours">{{ game.playtimeHours }}h</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Analysis Section -->
        <div class="ai-card">
          <div class="ai-header">
            <h2>🤖 AI Analysis</h2>
          </div>
          
          <div v-if="aiLoading" class="ai-loading">
            <div class="spinner"></div>
            <p>AI is analyzing your gaming profile...</p>
          </div>
          
          <div v-else-if="aiAnalysis" class="ai-content">
            <pre class="ai-text">{{ aiAnalysis }}</pre>
          </div>
          
          <div v-else-if="aiError" class="ai-warning">
            ⚠️ {{ aiError }}
          </div>
          
          <div v-else class="ai-info">
            💡 Waiting for AI analysis...
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { SteamApiResponse } from '../types/steam'

interface PromptInfo {
  id: string
  name: string
  description: string
}

const steamId = ref('')
const loading = ref(false)
const errorMessage = ref('')
const steamData = ref<SteamApiResponse | null>(null)
const aiAnalysis = ref<string | null>(null)
const aiLoading = ref(false)
const aiError = ref('')
const availablePrompts = ref<PromptInfo[]>([])
const selectedPromptId = ref('default')

// Fetch available prompts on component mount
onMounted(async () => {
  try {
    const response = await $fetch<{ prompts: PromptInfo[] }>('/api/steam/prompts')
    availablePrompts.value = response.prompts
  } catch (error) {
    console.error('Failed to fetch prompts:', error)
    // Set default prompt if fetch fails
    availablePrompts.value = [
      { id: 'default', name: 'Default Analysis', description: 'Standard analysis' }
    ]
  }
})

const analyzProfile = async () => {
  if (!steamId.value.trim()) return
  
  loading.value = true
  errorMessage.value = ''
  steamData.value = null
  aiAnalysis.value = null
  aiError.value = ''
  
  try {
    // 第一步：获取 Steam 数据
    const data = await $fetch<SteamApiResponse>('/api/steam/games', {
      params: {
        steamId: steamId.value
      }
    })
    
    console.log('=== Steam Data Retrieved ===')
    console.log('Player:', data.player)
    console.log('Stats:', data.stats)
    console.log('Total Games:', data.games.length)
    console.log('Top 5 Games:', data.games.slice(0, 5))
    
    // Save and display Steam data
    steamData.value = data
    
    // Step 2: Send data to AI for analysis
    fetchAIAnalysis(data)
    
  } catch (error: any) {
    console.error('Error fetching Steam data:', error)
    errorMessage.value = error?.data?.message || 'Failed to fetch Steam data. Please check the Steam ID and try again.'
  } finally {
    loading.value = false
  }
}

const fetchAIAnalysis = async (data: SteamApiResponse) => {
  aiLoading.value = true
  aiError.value = ''
  
  try {
    console.log(`=== Sending to AI for Analysis (using prompt: ${selectedPromptId.value}) ===`)
    
    const response = await $fetch<{ success: boolean; analysis: string | null }>('/api/steam/analyze', {
      method: 'POST',
      body: data,
      params: {
        promptId: selectedPromptId.value
      }
    })
    
    if (response.success && response.analysis) {
      aiAnalysis.value = response.analysis
      console.log('=== AI Analysis Retrieved ===')
      console.log(response.analysis)
    } else {
      aiError.value = 'AI analysis returned empty result'
    }
  } catch (error: any) {
    console.error('Error fetching AI analysis:', error)
    aiError.value = error?.data?.message || 'Failed to get AI analysis. Please check if GEMINI_API_KEY is configured.'
  } finally {
    aiLoading.value = false
  }
}

</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: #e0e6ff;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.background-grid {
  position: absolute;
  inset: 0;
  background-color: transparent;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 70px, rgba(100, 150, 255, 0.06) 71px, transparent 72px),
    repeating-linear-gradient(60deg, transparent, transparent 70px, rgba(100, 150, 255, 0.06) 71px, transparent 72px),
    repeating-linear-gradient(120deg, transparent, transparent 70px, rgba(100, 150, 255, 0.06) 71px, transparent 72px);
  background-size: 100% 100%;
  animation: hexMove 40s linear infinite;
  opacity: 0.8;
}

@keyframes hexMove {
  0% { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 0 140px, 0 140px, 0 140px; }
}

.glow-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #667eea 0%, transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #764ba2 0%, transparent 70%);
  bottom: -250px;
  right: -250px;
  animation-delay: 2s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #f093fb 0%, transparent 70%);
  top: 50%;
  right: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}

.main-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  width: 90%;
  padding: 3rem 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  letter-spacing: 0.05em;
}

.title-icon {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes titleGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

.subtitle {
  font-size: 1.1rem;
  color: #a0aec0;
  margin: 0;
  font-weight: 300;
}

.input-section {
  margin-bottom: 3rem;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.steam-input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  color: #e0e6ff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
}

.steam-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

.steam-input::placeholder {
  color: #718096;
}

/* Prompt Selector Styles */
.prompt-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.prompt-selector label {
  color: #cbd5e0;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
}

.prompt-select {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  color: #e0e6ff;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.prompt-select:hover {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.prompt-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.2);
}

.prompt-select option {
  background: #1a1f3a;
  color: #e0e6ff;
  padding: 0.5rem;
}

.analyze-btn {
  width: 100%;
  padding: 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.analyze-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.analyze-btn:not(:disabled):active {
  transform: translateY(0);
}

.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-content {
  position: relative;
  z-index: 1;
}

.btn-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(10px);
  z-index: 0;
}

.analyze-btn:not(:disabled):hover .btn-glow {
  opacity: 0.7;
}

.loading-text {
  display: inline-flex;
  gap: 0.2rem;
}

.dot {
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 60%, 100% { opacity: 1; }
  30% { opacity: 0.3; }
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  animation: iconFloat 3s ease-in-out infinite;
}

.feature-card:nth-child(2) .feature-icon {
  animation-delay: 1s;
}

.feature-card:nth-child(3) .feature-icon {
  animation-delay: 2s;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.feature-text {
  font-size: 0.9rem;
  color: #cbd5e0;
  font-weight: 500;
}

@media (max-width: 640px) {
  .title {
    font-size: 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 2rem 1rem;
  }
}

/* Results Section Styles */
.results-section {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.steam-card,
.ai-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.steam-header,
.ai-header {
  margin-bottom: 1.5rem;
}

.steam-header h2,
.ai-header h2 {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #e0e6ff;
  font-weight: 600;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.player-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(124, 58, 237, 0.5);
}

.player-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e0e6ff;
  margin-bottom: 0.25rem;
}

.player-stats {
  font-size: 0.9rem;
  color: #94a3b8;
}

.top-games {
  margin-top: 1.5rem;
}

.top-games h3 {
  font-size: 1.1rem;
  color: #cbd5e0;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.game-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.game-item:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(4px);
}

.game-rank {
  font-weight: 700;
  color: #667eea;
  min-width: 2rem;
  text-align: center;
}

.game-name {
  flex: 1;
  color: #e0e6ff;
  font-size: 0.95rem;
}

.game-hours {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

/* AI Analysis Styles */
.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(124, 58, 237, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ai-loading p {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
}

.ai-content {
  margin-top: 0.5rem;
}

.ai-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: #cbd5e0;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border-left: 4px solid rgba(124, 58, 237, 0.6);
}

.ai-warning,
.ai-info {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.ai-warning {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.ai-info {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #f87171;
  font-size: 0.95rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
</style>
