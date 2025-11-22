<template>
  <div class="roast-analysis">
    <div class="analysis-card">
      <h3 class="section-title">
        <span class="title-icon">🔍</span>
        罪名清单
      </h3>
      <div class="analysis-content">
        <div v-for="(item, index) in parsedCharges" :key="index" class="charge-item">
          <div class="charge-header">
            <span class="charge-badge">{{ index + 1 }}</span>
            <h4 class="charge-title">{{ item.charge }}</h4>
          </div>
          <p class="charge-comment">{{ item.comment }}</p>
        </div>
        
        <!-- Fallback for non-structured content -->
        <div v-if="parsedCharges.length === 0" class="fallback-content">
          <p v-for="(paragraph, index) in paragraphs" :key="index" class="paragraph">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: string
}

const props = defineProps<Props>()

// Parse charges from content
const parsedCharges = computed(() => {
  const charges: { charge: string; comment: string }[] = []
  const pattern = /@罪名:([^\n]+)\n([^\n@]+(?:\n(?!@)[^\n]+)*)/g
  const matches = props.content.matchAll(pattern)
  
  for (const match of matches) {
    if (match[1] && match[2]) {
      charges.push({
        charge: match[1].trim(),
        comment: match[2].trim()
      })
    }
  }
  
  return charges
})

// Fallback paragraphs if no charges found
const paragraphs = computed(() => {
  if (parsedCharges.value.length > 0) return []
  
  return props.content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0 && !p.startsWith('@罪名:'))
})
</script>

<style scoped>
.roast-analysis {
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease-out 0.2s both;
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

.analysis-card {
  background: rgba(20, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.analysis-card:hover {
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
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

.analysis-content {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
}

.charge-item {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: rgba(30, 30, 60, 0.4);
  border-left: 3px solid rgba(239, 68, 68, 0.5);
  border-radius: 8px;
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease-out both;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.charge-item:hover {
  border-left-color: rgba(239, 68, 68, 0.8);
  background: rgba(40, 40, 80, 0.5);
  transform: translateX(5px);
}

.charge-item:last-child {
  margin-bottom: 0;
}

.charge-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.charge-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.charge-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
  flex: 1;
}

.charge-comment {
  margin: 0;
  padding-left: 2rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Fallback styles */
.fallback-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.paragraph {
  margin: 0;
  padding-left: 1rem;
  border-left: 3px solid rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.paragraph:hover {
  border-left-color: rgba(102, 126, 234, 0.6);
  padding-left: 1.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 4px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .analysis-card {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .charge-item {
    padding: 1rem;
  }
  
  .charge-title {
    font-size: 1rem;
  }
  
  .charge-comment {
    padding-left: 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
