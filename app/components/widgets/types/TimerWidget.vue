<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps<{
  data: Record<string, any>
  isEditing?: boolean
}>()

const emit = defineEmits<{
  save: [data: Record<string, any>]
}>()

// Default to 5 minutes (300 seconds) if not provided
const initialDuration = computed(() => Number(props.data.duration) || 300)
const timeLeft = ref(initialDuration.value)
const isRunning = ref(false)
const editDuration = ref(Math.floor(initialDuration.value / 60))

let timerInterval: number | null = null

const playRing = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      
      const startTime = ctx.currentTime + delay;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
      
      osc.start(startTime);
      osc.stop(startTime + 1.5);
    };

    playNote(880, 0);       // A5
    playNote(1108.73, 0.2); // C#6
  } catch(e) {
    console.error(e);
  }
}

const start = () => {
  if (isRunning.value || timeLeft.value <= 0) return
  isRunning.value = true
  timerInterval = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      pause()
      playRing()
    }
  }, 1000)
}

const pause = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const reset = () => {
  pause()
  timeLeft.value = initialDuration.value
}

const toggle = () => {
  if (isRunning.value) pause()
  else start()
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

watch(() => props.data.action, (action) => {
  if (action === 'start') start()
  else if (action === 'pause' || action === 'stop') pause()
  else if (action === 'reset') reset()
})

watch(() => props.data.duration, (newVal) => {
  if (!isRunning.value && newVal !== undefined) {
    timeLeft.value = Number(newVal) || 300
    editDuration.value = Math.floor(timeLeft.value / 60)
  }
})

watch(() => props.isEditing, (editing) => {
  if (editing) {
    pause()
    editDuration.value = Math.floor(initialDuration.value / 60)
  } else {
    const newSeconds = Math.max(1, editDuration.value * 60)
    emit('save', { duration: newSeconds })
    timeLeft.value = newSeconds
  }
})

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const progress = computed(() => {
  return ((initialDuration.value - timeLeft.value) / initialDuration.value) * 100
})
</script>

<template>
  <div class="timer-widget-content">
    <div v-if="isEditing" class="timer-edit">
      <label>Minutes:</label>
      <input type="number" v-model="editDuration" min="1" max="999" class="timer-input" />
    </div>
    <div v-else class="timer-display" @click="toggle">
      <!-- Progress Ring SVG -->
      <svg class="progress-ring" viewBox="0 0 100 100">
        <circle class="progress-ring-track" cx="50" cy="50" r="45"></circle>
        <circle 
          class="progress-ring-circle" 
          cx="50" cy="50" r="45"
          :stroke-dasharray="283"
          :stroke-dashoffset="283 - (283 * progress) / 100"
        ></circle>
      </svg>
      
      <div class="time-text" :class="{ 'time-ending': timeLeft <= 10 && isRunning }">
        {{ formattedTime }}
      </div>
      
      <div class="timer-controls">
        <button class="control-btn" @click.stop="toggle" :title="isRunning ? 'Pause' : 'Start'">
          <svg v-if="isRunning" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </button>
        <button class="control-btn" @click.stop="reset" title="Reset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer-widget-content {
  padding: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.timer-display {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.progress-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  width: min(90%, 100vh); /* Scale based on available space */
  height: min(90%, 100vh);
  max-width: 200px;
  max-height: 200px;
}

.progress-ring-track {
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 4;
}
html.light .progress-ring-track {
  stroke: rgba(0, 0, 0, 0.05);
}

.progress-ring-circle {
  fill: transparent;
  stroke: var(--accent, #ff6b8b);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}

.time-text {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: clamp(2rem, 15cqw, 4rem);
  font-weight: 300;
  letter-spacing: -0.05em;
  z-index: 2;
  transition: color 0.3s ease;
}

.time-ending {
  color: #ef4444;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from { opacity: 1; }
  to { opacity: 0.5; }
}

.timer-controls {
  position: absolute;
  bottom: 24px;
  display: flex;
  gap: 12px;
  z-index: 2;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.2s ease;
}

.timer-display:hover .timer-controls {
  opacity: 1;
  transform: translateY(0);
}

.control-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

html.light .control-btn {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: var(--accent, #ff6b8b);
  color: #fff;
  border-color: transparent;
  transform: scale(1.1);
}

.timer-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.timer-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
  width: 100px;
  text-align: center;
  outline: none;
}

html.light .timer-input {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(0, 0, 0, 0.1);
}

.timer-input:focus {
  border-color: var(--accent, #ff6b8b);
}
</style>
