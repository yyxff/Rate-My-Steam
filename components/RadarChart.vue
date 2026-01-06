<template>
  <div class="radar-chart">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- Background hexagon grid -->
      <g :transform="`translate(${center}, ${center})`">
        <!-- Grid levels (5 levels) -->
        <polygon
          v-for="level in 5"
          :key="`grid-${level}`"
          :points="getHexagonPoints(level * scale / 5)"
          class="grid-line"
          fill="none"
          :stroke="gridColor"
          :stroke-width="level === 5 ? 2 : 1"
          :opacity="level === 5 ? 0.4 : 0.2"
        />
        
        <!-- Axis lines -->
        <line
          v-for="(dimension, index) in displayDimensions"
          :key="`axis-${index}`"
          x1="0"
          y1="0"
          :x2="getPoint(index, scale).x"
          :y2="getPoint(index, scale).y"
          :stroke="gridColor"
          stroke-width="1"
          opacity="0.3"
        />
        
        <!-- Data polygon -->
        <polygon
          :points="getDataPoints()"
          class="data-area"
          :fill="fillColor"
          :stroke="strokeColor"
          stroke-width="2"
          fill-opacity="0.3"
        />
        
        <!-- Data points -->
        <circle
          v-for="(dimension, index) in displayDimensions"
          :key="`point-${index}`"
          :cx="getPoint(index, dimension.value * scale / 5).x"
          :cy="getPoint(index, dimension.value * scale / 5).y"
          r="4"
          :fill="strokeColor"
          class="data-point"
        />
        
        <!-- Labels -->
        <text
          v-for="(dimension, index) in displayDimensions"
          :key="`label-${index}`"
          :x="getPoint(index, scale + 40).x"
          :y="getPoint(index, scale + 40).y"
          class="dimension-label"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ dimension.name }}
        </text>
        
        <!-- Descriptions in parentheses -->
        <foreignObject
          v-for="(dimension, index) in displayDimensions"
          :key="`desc-${index}`"
          :x="getPoint(index, scale + 100).x - 90"
          :y="getPoint(index, scale + 100).y - 20"
          width="180"
          height="60"
          style="color: #f87171;"
        >
          <div 
            class="dimension-desc" 
            xmlns="http://www.w3.org/1999/xhtml" 
            v-if="dimension.description"
            :style="{
              color: '#f87171 !important',
              fontWeight: '600',
              textShadow: '0 0 6px rgba(248, 113, 113, 0.4)',
              fontSize: '12px',
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: '1.4'
            }"
          >
            ({{ dimension.description }})
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Dimension {
  name: string
  value: number // 0-5
  description?: string // 括号里的说明文字
}

interface Props {
  dimensions: Dimension[]
  size?: number
  fillColor?: string
  strokeColor?: string
  gridColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 500,
  fillColor: 'rgba(102, 126, 234, 0.5)',
  strokeColor: '#667eea',
  gridColor: 'rgba(255, 255, 255, 0.3)'
})

const center = computed(() => props.size / 2)
const scale = computed(() => (props.size / 2) * 0.4)

// Ensure we always have exactly 6 dimensions for hexagon
const displayDimensions = computed(() => {
  const dims = [...props.dimensions]
  
  // Pad with empty dimensions if less than 6
  while (dims.length < 6) {
    dims.push({
      name: '-',
      value: 0,
      description: ''
    })
  }
  
  // Take only first 6 if more than 6
  return dims.slice(0, 6)
})

// Calculate hexagon points (always 6 sides)
const getHexagonPoints = (radius: number) => {
  const points: string[] = []
  
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    points.push(`${x},${y}`)
  }
  
  return points.join(' ')
}

// Get point coordinates (always 6 sides)
const getPoint = (index: number, radius: number) => {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  }
}

// Get data polygon points
const getDataPoints = () => {
  const points: string[] = []
  displayDimensions.value.forEach((dimension, index) => {
    const radius = (dimension.value * scale.value) / 5
    const point = getPoint(index, radius)
    points.push(`${point.x},${point.y}`)
  })
  return points.join(' ')
}
</script>

<style scoped>
.radar-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.grid-line {
  transition: all 0.3s ease;
}

.data-area {
  transition: all 0.5s ease;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.data-point {
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 4px rgba(102, 126, 234, 0.6));
}

.data-point:hover {
  r: 6;
  filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.8));
}

.dimension-label {
  font-size: 14px;
  font-weight: 700;
  fill: #fbbf24;
  pointer-events: none;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
  letter-spacing: 0.5px;
}

.dimension-value {
  font-size: 11px;
  font-weight: 500;
  fill: #94a3b8;
  pointer-events: none;
}

.dimension-desc {
  font-size: 12px;
  color: #f87171;
  text-align: center;
  line-height: 1.4;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-style: italic;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(248, 113, 113, 0.4);
  opacity: 0.95;
}

@media (max-width: 768px) {
  .dimension-label {
    font-size: 11px;
  }
  
  .dimension-value {
    font-size: 9px;
  }
  
  .dimension-desc {
    font-size: 8px;
  }
}
</style>

<style>
/* 导出模板专用样式 - 非scoped，优先级更高 */
.export-template-wrapper .dimension-desc {
  color: #f87171 !important;
  font-weight: 600 !important;
  text-shadow: 0 0 6px rgba(248, 113, 113, 0.4) !important;
}
</style>
