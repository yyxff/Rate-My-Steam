<template>
  <div class="roast-analysis">
    <div class="analysis-card">
      <h3 class="section-title">
        <span class="title-icon">🔍</span>
        罪名清单
      </h3>
      <div class="charges-grid">
        <div v-for="(item, index) in charges" :key="index" class="charge-item">
          <div class="charge-header">
            <span class="charge-badge">{{ index + 1 }}</span>
            <h4 class="charge-title">{{ item.charge }}</h4>
          </div>
          <p class="charge-comment">{{ item.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ChargeItem {
  charge: string
  comment: string
}

interface Props {
  charges: ChargeItem[]
}

defineProps<Props>()
</script>

<style scoped>
.roast-analysis {
  margin-bottom: 2rem;
}

.analysis-card {
  background: rgba(20, 20, 40, 0.6);
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

/* 两列布局 */
.charges-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.charge-item {
  margin-bottom: 0;
  padding: 1.25rem;
  background: rgba(30, 30, 60, 0.4);
  border-left: 3px solid rgba(239, 68, 68, 0.5);
  border-radius: 8px;
  min-width: 0;
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
</style>
