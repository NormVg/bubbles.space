<template>
  <div class="ai-loader" :style="cssVars">
    <div 
      v-for="(active, index) in currentShape" 
      :key="index"
      class="pixel"
      :class="{ active: active }"
      :style="{ transitionDelay: `${delays[index]}ms` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  size?: number
  speed?: number
  mode?: 'idle' | 'thinking' | 'tool' | 'speaking'
}>(), {
  color: '#ff6b8b', 
  size: 24,
  speed: 500,
  mode: 'thinking'
})

const cssVars = computed(() => ({
  '--glow-color': props.color,
  '--size': `${props.size}px`,
}))

const shapeLibrary = {
  idle: [
    [0, 0, 0,   0, 1, 0,   0, 0, 0], // Center dot
    [0, 0, 0,   0, 0, 0,   0, 0, 0], // Empty (breathing)
  ],
  thinking: [
    [0, 1, 0,   1, 1, 1,   0, 1, 0], // Cross (+)
    [1, 0, 1,   0, 1, 0,   1, 0, 1], // X
    [1, 1, 0,   1, 1, 0,   0, 0, 0], // Top Left Block
    [0, 1, 1,   0, 1, 1,   0, 0, 0], // Top Right Block
    [0, 0, 0,   0, 1, 1,   0, 1, 1], // Bottom Right Block
    [0, 0, 0,   1, 1, 0,   1, 1, 0], // Bottom Left Block
  ],
  tool: [
    [1, 1, 1,   1, 0, 1,   1, 1, 1], // Hollow Square
    [1, 0, 1,   0, 0, 0,   1, 0, 1], // Corners
    [0, 1, 0,   1, 0, 1,   0, 1, 0], // Diamond
  ],
  speaking: [
    [0, 0, 0,   0, 0, 0,   1, 1, 1], // Low
    [0, 0, 0,   1, 1, 1,   1, 1, 1], // Mid
    [1, 1, 1,   1, 1, 1,   1, 1, 1], // High
    [0, 1, 0,   1, 1, 1,   1, 1, 1], // Peak
  ]
}

const currentSpeed = computed(() => {
  if (props.speed !== 500) return props.speed // Override
  switch (props.mode) {
    case 'idle': return 1000
    case 'tool': return 250
    case 'speaking': return 150
    case 'thinking': return 400
    default: return 500
  }
})

const currentShapeIndex = ref(0)
const currentShape = computed(() => {
  const shapes = shapeLibrary[props.mode] || shapeLibrary.thinking
  return shapes[currentShapeIndex.value % shapes.length] || shapes[0]
})

const delays = ref<number[]>(Array(9).fill(0))
let interval: ReturnType<typeof setInterval> | null = null

const nextShape = () => {
  const shapes = shapeLibrary[props.mode] || shapeLibrary.thinking
  delays.value = Array(9).fill(0).map(() => Math.random() * (currentSpeed.value * 0.5))
  
  let next = currentShapeIndex.value
  if (shapes.length > 1) {
    while (next === currentShapeIndex.value) {
      next = Math.floor(Math.random() * shapes.length)
    }
  } else {
    next = 0
  }
  currentShapeIndex.value = next
}

const startLoop = () => {
  if (interval) clearInterval(interval)
  interval = setInterval(nextShape, currentSpeed.value)
}

watch(() => props.mode, () => {
  currentShapeIndex.value = 0
  startLoop()
})

onMounted(() => startLoop())

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.ai-loader {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: var(--size);
  height: var(--size);
  gap: 1px; /* The small gap between pixels */
  position: relative;
}

/* Optional: Add a subtle ambient glow behind the entire loader */
.ai-loader::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%);
  background: var(--glow-color);
  opacity: 0.15;
  filter: blur(8px);
  pointer-events: none;
  z-index: 0;
}

.pixel {
  background-color: var(--glow-color);
  opacity: 0.05;
  border-radius: 1px; /* tiny rounding for sub-pixel rendering */
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.pixel.active {
  opacity: 1;
  box-shadow: 0 0 6px var(--glow-color), 0 0 12px var(--glow-color);
}
</style>
