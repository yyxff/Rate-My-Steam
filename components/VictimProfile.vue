<template>
  <div class="victim-profile">
    <div class="profile-card">
      <div class="card-header">
        <span class="header-icon">⚖️</span>
        <h3 class="header-title">受害者档案</h3>
      </div>
      <div class="profile-content">
        <div class="profile-item">
          <span class="item-label">玩家</span>
          <span class="item-value player-name">{{ playerName }}</span>
        </div>
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-label">游戏囤积症</span>
            <div class="stat-value">
              <span class="highlight-number">{{ totalGames }}</span>
              <span class="unit">款</span>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-label">人生虚度</span>
            <div class="stat-value">
              <span class="highlight-number">{{ totalHours }}</span>
              <span class="unit">h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  playerName: string
  totalGames: number
  totalHours: number
}

defineProps<Props>()
</script>

<style scoped>
.victim-profile {
  margin-bottom: 1.5rem;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  /* 移除 backdrop-filter 以减少 GPU 消耗 */
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ef4444, #dc2626, #ef4444);
  animation: scanline 3s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.profile-card:hover {
  border-color: rgba(239, 68, 68, 0.4);
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(239, 68, 68, 0.15);
}

.header-icon {
  font-size: 1.3rem;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.5));
}

.header-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profile-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.profile-item:hover {
  background: rgba(239, 68, 68, 0.08);
}

.item-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.item-value {
  font-size: 1rem;
  font-weight: 600;
  color: #e0e6ff;
}

.player-name {
  color: #fbbf24;
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

.profile-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.highlight-number {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ef4444, #f87171);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.unit {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: linear-gradient(to bottom, transparent, rgba(239, 68, 68, 0.3), transparent);
}

@media (max-width: 768px) {
  .profile-card {
    padding: 0.875rem 1.25rem;
  }
  
  .profile-stats {
    gap: 0.75rem;
  }
  
  .highlight-number {
    font-size: 1.3rem;
  }
}
</style>
