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
const editMinutes = ref(Math.floor(initialDuration.value / 60))
const editSeconds = ref(initialDuration.value % 60)

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
    editMinutes.value = Math.floor(timeLeft.value / 60)
    editSeconds.value = timeLeft.value % 60
  }
})

watch(() => props.isEditing, (editing) => {
  if (editing) {
    pause()
    editMinutes.value = Math.floor(initialDuration.value / 60)
    editSeconds.value = initialDuration.value % 60
  } else {
    const newSeconds = Math.max(1, editMinutes.value * 60 + editSeconds.value)
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
      <label class="edit-label">Set Timer</label>
      <div class="time-inputs">
        <div class="time-input-group">
          <input type="number" v-model="editMinutes" min="0" max="999" class="timer-input" />
          <span class="time-label">m</span>
        </div>
        <span class="time-separator">:</span>
        <div class="time-input-group">
          <input type="number" v-model="editSeconds" min="0" max="59" class="timer-input" />
          <span class="time-label">s</span>
        </div>
      </div>
    </div>
    <div v-else class="timer-display" @click="toggle">
      <div class="ring-container">
        <!-- Progress Ring SVG -->
        <svg class="progress-ring" viewBox="0 0 100 100">
          <circle class="progress-ring-track" cx="50" cy="50" r="46"></circle>
          <circle 
            class="progress-ring-circle" 
            cx="50" cy="50" r="46"
            :stroke-dasharray="289.02"
            :stroke-dashoffset="289.02 - (289.02 * progress) / 100"
          ></circle>
        </svg>
        
        <div class="time-text" :class="{ 'time-ending': timeLeft <= 10 && isRunning }">
          {{ formattedTime }}
        </div>
      </div>
      
      <div class="timer-controls-pill" @click.stop>
        <button class="control-btn" @click.stop="toggle" :title="isRunning ? 'Pause' : 'Start'">
          <svg v-if="isRunning" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z"></path></svg>
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
  font-family: var(--font-sans);
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

.ring-container {
  position: relative;
  width: min(90%, 100vh);
  height: min(90%, 100vh);
  max-width: 260px;
  max-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
}

.progress-ring-track {
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.03);
  stroke-width: 2;
}

html.light .progress-ring-track {
  stroke: rgba(0, 0, 0, 0.05);
}

.progress-ring-circle {
  fill: transparent;
  stroke: var(--accent, #a78bfa);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 0 4px rgba(167, 139, 250, 0.3));
}

.time-text {
  font-family: var(--font-mono, 'SF Mono', monospace);
  font-size: clamp(2.5rem, 18cqi, 5rem);
  font-weight: 300;
  letter-spacing: -0.05em;
  color: var(--text-primary);
  z-index: 2;
  transition: color 0.3s ease;
  user-select: none;
}

.time-ending {
  color: #ef4444;
  animation: pulse 1s infinite alternate cubic-bezier(0.4, 0, 0.6, 1);
  text-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(0.98); }
}

.timer-controls-pill {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translate(-50%, 16px) scale(0.95);
  display: flex;
  gap: 4px;
  padding: 6px;
  border-radius: 32px;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2);
}

html.light .timer-controls-pill {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
}

.timer-display:hover .timer-controls-pill {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0) scale(1);
}

.control-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  color: var(--text-primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

html.light .control-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Edit Mode Styles */
.timer-edit {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  background: var(--bg-soft);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.2);
}

.edit-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-input-group {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.time-separator {
  font-weight: 300;
  font-size: 24px;
  color: var(--text-muted);
  margin-top: -4px;
}

.time-label {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.timer-input {
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 8px 0;
  border-radius: 8px;
  font-size: 24px;
  font-weight: 300;
  font-family: var(--font-mono, monospace);
  width: 72px;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
}

.timer-input:focus {
  border-color: var(--accent, #a78bfa);
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.2);
}
</style>
