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
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  size?: number
  speed?: number
}>(), {
  color: '#ff6b8b', // Default pink glow
  size: 24,
  speed: 500 // ms per shape
})

const cssVars = computed(() => ({
  '--glow-color': props.color,
  '--size': `${props.size}px`,
}))

// Define iconic 3x3 shapes (1 = active, 0 = inactive)
const shapes = [
  [0, 1, 0,   1, 1, 1,   0, 1, 0], // Cross (+)
  [1, 0, 1,   0, 1, 0,   1, 0, 1], // X
  [1, 1, 0,   1, 1, 0,   0, 0, 0], // Top Left Block
  [0, 1, 1,   0, 1, 1,   0, 0, 0], // Top Right Block
  [0, 0, 0,   0, 1, 1,   0, 1, 1], // Bottom Right Block
  [0, 0, 0,   1, 1, 0,   1, 1, 0], // Bottom Left Block
  [1, 1, 1,   1, 0, 1,   1, 1, 1], // Hollow Square
  [0, 1, 0,   0, 1, 0,   0, 1, 0], // Vertical Line
]

const currentShapeIndex = ref(0)
const currentShape = computed(() => shapes[currentShapeIndex.value])

// Random delays for organic transition (to make it feel alive)
const delays = ref<number[]>(Array(9).fill(0))

let interval: ReturnType<typeof setInterval> | null = null

const nextShape = () => {
  // Generate a new random delay for each pixel to break monotony
  delays.value = Array(9).fill(0).map(() => Math.random() * 200)
  
  // Pick a random next shape, avoiding repeating the exact same one immediately
  let next = currentShapeIndex.value
  while (next === currentShapeIndex.value) {
    next = Math.floor(Math.random() * shapes.length)
  }
  currentShapeIndex.value = next
}

onMounted(() => {
  interval = setInterval(nextShape, props.speed)
})

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
  filter: blur(12px);
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
