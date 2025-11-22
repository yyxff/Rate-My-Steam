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
    </main>
  </div>
</template>

<script setup lang="ts">
const steamId = ref('')
const loading = ref(false)

const analyzProfile = async () => {
  if (!steamId.value.trim()) return
  
  loading.value = true
  
  // TODO: backend API
  setTimeout(() => {
    loading.value = false
    console.log('Analyzing:', steamId.value)
  }, 2000)
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
</style>
