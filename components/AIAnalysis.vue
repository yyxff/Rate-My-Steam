<template>
  <div class="ai-analysis">
    <div class="ai-header">
      <h2>🤖 AI Analysis</h2>
    </div>
    
    <div v-if="loading" class="ai-loading">
      <div class="spinner"></div>
      <p>AI is analyzing your gaming profile...</p>
    </div>
    
    <div v-else-if="analysis" class="ai-content">
      <pre class="ai-text">{{ analysis }}</pre>
    </div>
    
    <div v-else-if="error" class="ai-warning">
      ⚠️ {{ error }}
    </div>
    
    <div v-else class="ai-info">
      💡 Waiting for AI analysis...
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  analysis: string | null
  error: string
}

defineProps<Props>()
</script>

<style scoped>
.ai-analysis {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  min-height: 400px;
}

.ai-header {
  margin-bottom: 1.5rem;
}

.ai-header h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #e0e6ff;
  font-weight: 600;
}

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
</style>
