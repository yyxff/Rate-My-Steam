<template>
  <div class="personality-title">
    <div class="title-card">
      <div class="icon">🎭</div>
      <div class="title-content">
        <h3 class="label">游戏人格</h3>
        <p class="title-text">{{ title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
.personality-title {
  margin-bottom: 2rem;
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.title-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.title-card:hover::before {
  opacity: 1;
}

.title-card:hover {
  transform: translateY(-5px);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.title-content {
  flex: 1;
}

.label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.title-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .title-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .icon {
    font-size: 2.5rem;
  }
  
  .title-text {
    font-size: 1.2rem;
  }
}
</style>
