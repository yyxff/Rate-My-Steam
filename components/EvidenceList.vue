<template>
  <div class="evidence-list">
    <div class="evidence-card">
      <h3 class="section-title">
        <span class="title-icon">📋</span>
        罪证清单
      </h3>
      <div class="evidence-grid">
        <div 
          v-for="(item, index) in items" 
          :key="index" 
          class="evidence-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="item-header">
            <span class="item-number">{{ index + 1 }}</span>
            <span class="game-name">{{ item.game }}</span>
          </div>
          <div class="item-body">
            <div class="hours-badge">
              <span class="hours-value">{{ item.hours }}</span>
              <span class="hours-label">小时</span>
            </div>
            <p v-if="item.comment" class="comment">{{ item.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface EvidenceItem {
  game: string
  hours: string
  comment?: string
}

interface Props {
  items: EvidenceItem[]
}

defineProps<Props>()
</script>

<style scoped>
.evidence-list {
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.evidence-card {
  background: rgba(20, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e0e6ff;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.5));
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.evidence-item {
  background: rgba(30, 30, 60, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease-out both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.evidence-item:hover {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(40, 40, 80, 0.6);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.item-number {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.game-name {
  color: #e0e6ff;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.3;
  flex: 1;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hours-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  background: rgba(102, 126, 234, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  align-self: flex-start;
}

.hours-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.hours-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.comment {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
  padding-left: 0.75rem;
  border-left: 2px solid rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .evidence-grid {
    grid-template-columns: 1fr;
  }
  
  .evidence-card {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
}
</style>
