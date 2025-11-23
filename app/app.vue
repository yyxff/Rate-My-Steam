<template>
  <div class="app-container">
    <div class="background-grid"></div>
    <div class="glow-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    
    <!-- GitHub Corner Badge -->
    <a href="https://github.com/yyxff/rate-my-steam" target="_blank" rel="noopener noreferrer" class="github-corner" aria-label="View source on GitHub">
      <svg width="100" height="100" viewBox="0 0 250 250" style="fill:#667eea; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
      </svg>
    </a>
    
    <!-- Left Sidebar: Steam Data (Outside main-content, fixed) -->
    <aside v-if="steamData" class="steam-sidebar">
      <div class="steam-card sticky-card">
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
        
        <div class="top-games">
          <h3>Top 10 Most Played Games</h3>
          <div class="games-list">
            <div 
              v-for="(game, index) in sortedGames.slice(0, 10)" 
              :key="game.appId"
              class="game-item"
            >
              <div class="game-info">
                <span class="game-rank">{{ index + 1 }}</span>
                <span class="game-name">{{ game.name }}</span>
                <span class="game-hours">{{ game.playtimeHours }}h</span>
              </div>
              <div class="progress-bar-container">
                <div 
                  class="progress-bar" 
                  :style="{ 
                    width: (game.playtimeHours / maxPlaytime * 100) + '%'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    
    <main class="main-content" :class="{ 'with-sidebar': steamData }">
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

        <!-- Prompt Selection - Hidden, only using fun analysis -->
        <!--
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
        -->

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

      <!-- AI Analysis (Right Column Only) -->
      <div v-if="steamData" class="ai-section">
        <div class="ai-card" ref="analysisContent">
          <div class="ai-header">
            <h2>🤖 AI Analysis</h2>
          </div>
          
          <div v-if="aiLoading" class="ai-loading">
            <div class="spinner"></div>
            <p>AI is analyzing your gaming profile...</p>
          </div>
          
          <div v-else-if="aiAnalysis" class="ai-content">
            <!-- Personality Title -->
            <PersonalityTitle v-if="personalityTitle" :title="personalityTitle" />
            
            <!-- Victim Profile (受害者档案) -->
            <VictimProfile 
              v-if="steamData"
              :playerName="steamData.player.name"
              :totalGames="steamData.stats.totalGames"
              :totalHours="Math.floor(steamData.stats.totalPlaytime / 60)"
            />
            
            <!-- Radar Chart -->
            <div v-if="radarDimensions.length === 6" class="radar-section">
              <RadarChart :dimensions="radarDimensions" :size="500" />
            </div>
            
            <!-- Roast Analysis (罪证分析) -->
            <RoastAnalysis v-if="roastContent" :content="roastContent" />
            
            <!-- Full AI Text (for debugging/fallback) -->
            <details class="full-analysis-toggle">
              <summary>查看完整AI回答</summary>
              <pre class="ai-text">{{ aiAnalysis }}</pre>
            </details>
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
    
    <!-- Right Download Panel -->
    <aside v-if="aiAnalysis && !aiLoading" class="download-panel">
      <div class="download-card">
        <div class="download-options">
          <button 
            class="download-btn" 
            @click="downloadAsImage"
            :disabled="isGeneratingImage"
          >
            <span v-if="!isGeneratingImage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              下载为图片
            </span>
            <span v-else class="generating-text">
              生成中...
            </span>
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Hidden Export Template -->
    <div style="position: fixed; left: -9999px; top: 0;">
      <ExportImageTemplate
        v-if="aiAnalysis && steamData"
        ref="exportTemplateRef"
        :playerName="steamData.player.name"
        :playerAvatar="steamData.player.avatar"
        :totalGames="steamData.stats.totalGames"
        :totalHours="Math.floor(steamData.stats.totalPlaytime / 60)"
        :personalityTitle="personalityTitle"
        :radarDimensions="radarDimensions"
        :roastCharges="roastCharges"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'
import RadarChart from '../components/RadarChart.vue'
import PersonalityTitle from '../components/PersonalityTitle.vue'
import VictimProfile from '../components/VictimProfile.vue'
import RoastAnalysis from '../components/RoastAnalysis.vue'
import ExportRoastAnalysis from '../components/ExportRoastAnalysis.vue'
import ExportImageTemplate from '../components/ExportImageTemplate.vue'
import type { SteamApiResponse } from '../types/steam'

interface PromptInfo {
  id: string
  name: string
  description: string
}

interface RadarDimension {
  name: string
  value: number
  description?: string
}

const steamId = ref('')
const loading = ref(false)
const errorMessage = ref('')
const steamData = ref<SteamApiResponse | null>(null)
const aiAnalysis = ref<string | null>(null)
const aiLoading = ref(false)
const aiError = ref('')
const analysisContent = ref<HTMLElement | null>(null)
const isGeneratingImage = ref(false)
const availablePrompts = ref<PromptInfo[]>([])
const selectedPromptId = ref('fun') // Default to fun analysis
const radarDimensions = ref<RadarDimension[]>([])
const personalityTitle = ref<string>('')
const roastContent = ref<string>('')
const exportTemplateRef = ref<{ rootRef: HTMLElement } | null>(null)
const roastCharges = ref<{ charge: string; comment: string }[]>([])

// Computed: Sorted games by playtime
const sortedGames = computed(() => {
  if (!steamData.value) return []
  return [...steamData.value.games].sort((a, b) => b.playtimeForever - a.playtimeForever)
})

// Computed: Max playtime for progress bar calculation
const maxPlaytime = computed(() => {
  if (!sortedGames.value.length) return 1
  return sortedGames.value[0]?.playtimeHours || 1
})

// Parse AI analysis to extract structured data
const parseAIAnalysis = (text: string) => {
  console.log('=== Parsing AI Analysis ===')
  console.log('Full text (first 500 chars):', text.substring(0, 500))
  
  // 1. Parse personality title (游戏人格称号)
  // Look for pattern: @游戏人格:xxxx
  const titlePattern = /@游戏人格:([^\n]+)/
  const titleMatch = text.match(titlePattern)
  personalityTitle.value = titleMatch?.[1]?.trim() || '神秘玩家'
  
  // 2. Parse radar dimensions (六边形评分维度)
  const dimensions: RadarDimension[] = []
  const pattern = /\*\s*([^:：\n]+)[：:]\s*(\d+(?:\.\d+)?)\s*(?:\(([^)]+)\))?/g
  const matches = text.matchAll(pattern)
  
  for (const match of matches) {
    if (match[1] && match[2]) {
      const name = match[1].trim()
      const value = parseFloat(match[2])
      const description = match[3] ? match[3].trim() : ''
      
      if (value >= 0 && value <= 5 && name.length > 1 && name.length < 30) {
        dimensions.push({ name, value, description })
      }
    }
  }
  
  radarDimensions.value = dimensions.length >= 6 ? dimensions.slice(0, 6) : [
    { name: '动作指数', value: 3.5, description: '快节奏游戏偏好' },
    { name: '策略思维', value: 3.0, description: '战术规划能力' },
    { name: '竞技欲望', value: 4.0, description: '对抗与竞争' },
    { name: '合作精神', value: 3.5, description: '团队配合意识' },
    { name: '挑战热情', value: 4.0, description: '追求高难度' },
    { name: '创造力', value: 3.0, description: '沙盒建造倾向' }
  ]
  
  // 3. Parse roast content (罪名清单 - the main commentary)
  // Extract charges with pattern: @罪名:xxx\n(content on next line)
  const charges: { charge: string; comment: string }[] = []
  
  // Pattern: @罪名:charge_name followed by newline and comment content
  const chargePattern = /@罪名:([^\n]+)\n([^\n@]+(?:\n(?!@)[^\n]+)*)/g
  const chargeMatches = text.matchAll(chargePattern)
  
  for (const match of chargeMatches) {
    if (match[1] && match[2]) {
      charges.push({
        charge: match[1].trim(),
        comment: match[2].trim()
      })
    }
  }
  
  // If we found charges, format them for display
  if (charges.length > 0) {
    roastContent.value = charges.map(c => `@罪名:${c.charge}\n${c.comment}`).join('\n\n')
    roastCharges.value = charges // Save for export
  } else {
    // Fallback: Extract content between title and evidence list
    let content = text
    
    // Remove personality title section  
    content = content.replace(/@游戏人格:[^\n]+[\n\r]*/i, '')
    
    // Remove radar dimensions section
    content = content.replace(/\*\s*[^:：\n]+[：:]\s*\d+(?:\.\d+)?\s*(?:\([^)]+\))?\n/g, '')
    
    // Remove 罪证清单 and everything after it
    content = content.replace(/【?罪证清单】?[\s\S]*$/, '')
    
    // Remove 受害者档案 header but keep content
    content = content.replace(/【?受害者档案】?[\n\r]*/i, '')
    
    // Clean up extra whitespace
    content = content.trim()
    
    roastContent.value = content
  }
  
  console.log('Parsed AI data:', {
    personalityTitle: personalityTitle.value,
    radarDimensions: radarDimensions.value,
    roastCharges: roastCharges.value,
    roastContent: roastContent.value
  })
}

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
      parseAIAnalysis(response.analysis)
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

// Download analysis as image
const downloadAsImage = async () => {
  console.log('downloadAsImage called')
  console.log('exportTemplateRef.value:', exportTemplateRef.value)
  console.log('steamData.value:', steamData.value)
  console.log('roastCharges.value:', roastCharges.value)
  console.log('roastCharges.value.length:', roastCharges.value.length)
  
  if (!exportTemplateRef.value || !steamData.value) {
    console.log('Early return: missing ref or steamData')
    return
  }
  
  isGeneratingImage.value = true
  
  try {
    // Clear any text selection before capturing
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges()
    }
    
    const exportComponent = exportTemplateRef.value
    if (!exportComponent || !exportComponent.rootRef) {
      throw new Error('Export element not found')
    }
    
    const exportElement = exportComponent.rootRef
    
    // Temporarily move to visible area for better rendering
    const originalLeft = exportElement.style.left
    exportElement.style.left = '0'
    exportElement.style.top = '0'
    
    // Wait a bit to ensure the export template is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Generating canvas...')
    // Use html2canvas to capture the export template
    const canvas = await html2canvas(exportElement, {
      backgroundColor: '#0a0e27',
      scale: 2, // Higher quality
      logging: true,
      useCORS: true,
      allowTaint: true,
      width: exportElement.scrollWidth,
      height: exportElement.scrollHeight
    })
    
    // Move back to hidden position
    exportElement.style.left = originalLeft
    
    console.log('Canvas generated, creating download...')
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const playerName = steamData.value?.player.name || 'player'
      const timestamp = new Date().getTime()
      link.download = `steam-evidence-${playerName}-${timestamp}.png`
      link.href = url
      link.click()
      
      // Clean up
      URL.revokeObjectURL(url)
      console.log('Download completed')
    }, 'image/png')
  } catch (error) {
    console.error('Error generating image:', error)
    alert('生成图片失败，请重试')
  } finally {
    isGeneratingImage.value = false
  }
}

</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 导出模板样式 - 修复 html2canvas 渲染问题 */
.export-template-wrapper {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  padding: 2rem;
  width: 1400px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 移除 background-clip: text 效果，避免 html2canvas 渲染问题 */
/* 但要允许正常的 color 属性工作 */
.export-template-wrapper .title-text,
.export-template-wrapper .header-title,
.export-template-wrapper .player-name,
.export-template-wrapper .highlight-number {
  -webkit-background-clip: border-box !important;
  background-clip: border-box !important;
  -webkit-text-fill-color: inherit !important;
}

/* 强制禁用所有动画和过渡效果，确保完全渲染 */
.export-template-wrapper,
.export-template-wrapper * {
  animation: none !important;
  transition: none !important;
  opacity: 1 !important;
}

/* 覆盖渐变文字效果，使用纯色 - 匹配页面实际颜色的鲜艳度 */
/* PersonalityTitle 游戏人格标题 - 使用渐变中间色 */
.export-template-wrapper .title-text {
  background: none !important;
  color: #7c3aed !important;
  font-weight: 700 !important;
}

/* VictimProfile 受害者档案 - 使用鲜艳的红色 */
.export-template-wrapper .header-title {
  background: none !important;
  color: #f87171 !important;
  font-weight: 700 !important;
}

.export-template-wrapper .player-name {
  background: none !important;
  color: #fbbf24 !important;
  font-weight: 600 !important;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.3) !important;
}

.export-template-wrapper .highlight-number {
  background: none !important;
  color: #f87171 !important;
  font-weight: 700 !important;
  font-size: 1.5rem !important;
}

/* RadarChart 雷达图 - 维度标签和描述 */
.export-template-wrapper .dimension-label {
  fill: #fbbf24 !important;
  font-weight: 700 !important;
}

.export-template-wrapper .dimension-desc {
  color: #f87171 !important;
  font-weight: 600 !important;
  opacity: 0.95 !important;
  text-shadow: 0 0 6px rgba(248, 113, 113, 0.4) !important;
}

/* 强制覆盖foreignObject中的div样式 */
.export-template-wrapper foreignObject {
  color: #f87171 !important;
}

.export-template-wrapper foreignObject .dimension-desc {
  color: #f87171 !important;
}

.export-template-wrapper foreignObject div {
  color: #f87171 !important;
}

/* 更强的选择器，覆盖所有可能的样式 */
.export-template-wrapper svg foreignObject div[class*="dimension-desc"] {
  color: #f87171 !important;
  font-weight: 600 !important;
}

/* 直接针对 SVG 内的 foreignObject 中的所有文本 */
.export-template-wrapper svg foreignObject * {
  color: #f87171 !important;
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
  /* 移除动画以减少 GPU 消耗 */
  opacity: 0.4;
}

/* 移除背景网格动画
@keyframes hexMove {
  0% { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 0 140px, 0 140px, 0 140px; }
}
*/

.glow-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  /* 减小模糊效果从 80px 到 40px 以降低 GPU 消耗 */
  filter: blur(40px);
  opacity: 0.2;
  /* 移除动画以减少 GPU 消耗 */
  /* animation: float 8s ease-in-out infinite; */
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #667eea 0%, transparent 70%);
  top: -200px;
  left: -200px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #764ba2 0%, transparent 70%);
  bottom: -250px;
  right: -250px;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #f093fb 0%, transparent 70%);
  top: 50%;
  right: 10%;
}

/* 移除浮动动画以减少 GPU 消耗
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}
*/

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
  /* 移除 backdrop-filter 以减少 GPU 消耗 */
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
  /* 移除 backdrop-filter 以减少 GPU 消耗 */
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
  /* 移除 backdrop-filter 以减少 GPU 消耗 */
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

/* Steam Sidebar - Fixed on left, outside main-content */
.steam-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 340px;
  height: 100vh;
  padding: 2rem 1.5rem 2rem 1.5rem;
  overflow-y: auto;
  z-index: 100;
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Custom scrollbar for steam sidebar */
.steam-sidebar::-webkit-scrollbar {
  display: none;
}

.steam-sidebar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* AI Section */
.ai-section {
  margin-top: 3rem;
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

.sticky-card {
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
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

@media (max-width: 1024px) {
  .steam-sidebar {
    position: static;
    width: 100%;
    height: auto;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
}

/* Custom scrollbar for sticky card */
.sticky-card::-webkit-scrollbar {
  display: none;
}

.sticky-card {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.steam-card,
.ai-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  /* 移除 backdrop-filter 以减少 GPU 消耗 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.ai-card {
  padding: 2rem;
}

.steam-header,
.ai-header {
  margin-bottom: 1.5rem;
}

.steam-header h2 {
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  color: #e0e6ff;
  font-weight: 600;
}

.ai-header h2 {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #e0e6ff;
  font-weight: 600;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

.player-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(124, 58, 237, 0.5);
}

.player-name {
  font-size: 1rem;
  font-weight: 600;
  color: #e0e6ff;
  margin-bottom: 0.25rem;
}

.player-stats {
  font-size: 0.8rem;
  color: #94a3b8;
}

.top-games h3 {
  font-size: 1rem;
  color: #cbd5e0;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
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

/* Progress Bar Styles */
.progress-bar-container {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  position: relative;
  transition: width 0.8s ease-out;
}

.progress-shimmer {
  display: none;
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

.radar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.full-analysis-toggle {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.full-analysis-toggle summary {
  cursor: pointer;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  user-select: none;
  transition: color 0.3s ease;
}

.full-analysis-toggle summary:hover {
  color: rgba(255, 255, 255, 0.9);
}

.full-analysis-toggle[open] summary {
  margin-bottom: 1rem;
  color: #667eea;
}

.ai-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  line-height: 1.8;
  color: #cbd5e0;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border-left: 3px solid rgba(124, 58, 237, 0.4);
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

/* Responsive Design */
@media (max-width: 1200px) {
  .results-container {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .results-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .sticky-card {
    position: relative;
    top: 0;
    max-height: none;
  }
  
  .left-column {
    order: 1;
  }
  
  .right-column {
    order: 2;
  }
}

@media (max-width: 768px) {
  .game-info {
    flex-wrap: wrap;
  }
  
  .game-name {
    flex: 1 1 100%;
    order: 2;
    margin-top: 0.25rem;
  }
  
  .game-rank {
    order: 1;
  }
  
  .game-hours {
    order: 3;
  }
  
  .prompt-selector {
    flex-direction: column;
    align-items: stretch;
  }
  
  .prompt-selector label {
    margin-bottom: 0.5rem;
  }
}

/* Download Panel Styles */
.download-panel {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.download-card {
  background: rgba(20, 20, 40, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.download-card:hover {
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e6ff;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-icon {
  font-size: 1.3rem;
}

.download-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.9rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  width: 100%;
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.download-btn:active:not(:disabled) {
  transform: translateY(0);
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.generating-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generating-text::after {
  content: '...';
  animation: dots 1.5s steps(3, end) infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

.download-tips {
  padding: 0.8rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.tip-text {
  margin: 0;
  font-size: 0.85rem;
  color: #a0aec0;
  line-height: 1.4;
}

@media (max-width: 1400px) {
  .download-panel {
    position: static;
    transform: none;
    margin: 2rem auto;
    max-width: 400px;
    animation: fadeIn 0.5s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* GitHub Corner Badge */
.github-corner {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.github-corner:hover {
  opacity: 1;
}

.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}

@keyframes octocat-wave {
  0%, 100% { transform: rotate(0); }
  20%, 60% { transform: rotate(-25deg); }
  40%, 80% { transform: rotate(10deg); }
}

@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }
  
  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}
</style>
