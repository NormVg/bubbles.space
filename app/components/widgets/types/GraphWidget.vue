<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  data: Record<string, any>
  isEditing: boolean
}>()

const emit = defineEmits<{
  save: [data: Record<string, any>]
}>()

const defaultData = {
  graphType: 'line',
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Dataset 1',
      values: [12, 19, 3, 5, 2],
      color: 'var(--accent)'
    }
  ]
}

const graphData = computed(() => {
  return { ...defaultData, ...props.data }
})

// Editing state
const editJson = ref(JSON.stringify(graphData.value, null, 2))
const jsonError = ref('')

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editJson.value = JSON.stringify(graphData.value, null, 2)
    jsonError.value = ''
  } else {
    try {
      const parsed = JSON.parse(editJson.value)
      emit('save', parsed)
    } catch (e) {
      // If parsing fails, revert to previous data silently to avoid breaking state
      emit('save', props.data)
    }
  }
})

const handleEditChange = () => {
  try {
    JSON.parse(editJson.value)
    jsonError.value = ''
  } catch (e: any) {
    jsonError.value = e.message
  }
}

// Animation trigger
const isMounted = ref(false)
onMounted(() => {
  // Slight delay for entry animation
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})

// Math & Layout
const viewBoxWidth = 800
const viewBoxHeight = 400
const padding = { top: 40, right: 40, bottom: 60, left: 60 }

const innerWidth = viewBoxWidth - padding.left - padding.right
const innerHeight = viewBoxHeight - padding.top - padding.bottom

const maxDataValue = computed(() => {
  let max = 0
  graphData.value.datasets.forEach(ds => {
    const dsMax = Math.max(...ds.values)
    if (dsMax > max) max = dsMax
  })
  // Add 10% headroom
  return max > 0 ? max * 1.1 : 10
})

const barLayout = computed(() => {
  const numDatasets = graphData.value.datasets.length
  const numLabels = graphData.value.labels.length || 1
  const maxGroupWidth = 80 // max width of a group of bars
  const groupWidth = Math.min(maxGroupWidth, (innerWidth / numLabels) * 0.7)
  const barWidth = groupWidth / numDatasets
  return { groupWidth, barWidth }
})

const getX = (index: number, count: number) => {
  if (count === 0) return padding.left + innerWidth / 2
  const bandWidth = innerWidth / count
  return padding.left + (index * bandWidth) + (bandWidth / 2)
}

const getY = (value: number) => {
  return padding.top + innerHeight - (value / maxDataValue.value) * innerHeight
}

// Line Chart
const generatePath = (values: number[]) => {
  if (!values.length) return ''
  return values.map((val, i) => {
    const x = getX(i, values.length)
    const y = getY(val)
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`
  }).join(' ')
}

const generateSmoothPath = (values: number[]) => {
  if (values.length < 2) return generatePath(values)
  let d = `M ${getX(0, values.length)},${getY(values[0])}`
  
  for (let i = 0; i < values.length - 1; i++) {
    const x0 = getX(i, values.length)
    const y0 = getY(values[i])
    const x1 = getX(i + 1, values.length)
    const y1 = getY(values[i + 1])
    
    // Bezier control points for smooth curve
    const cpX = (x0 + x1) / 2
    d += ` C ${cpX},${y0} ${cpX},${y1} ${x1},${y1}`
  }
  return d
}

// Pie Chart Logic
const pieSlices = computed(() => {
  if (graphData.value.graphType !== 'pie') return []
  
  // For pie, we just use the first dataset's values
  const ds = graphData.value.datasets[0]
  if (!ds || !ds.values.length) return []
  
  const total = ds.values.reduce((a, b) => Math.max(0, a) + Math.max(0, b), 0)
  if (total === 0) return []
  
  const cx = viewBoxWidth / 2
  const cy = viewBoxHeight / 2
  const r = Math.min(innerWidth, innerHeight) / 2 - 20
  
  let currentAngle = -Math.PI / 2 // Start at top
  const slices = []
  
  // We need distinct colors if not provided
  const defaultColors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1']
  
  for (let i = 0; i < ds.values.length; i++) {
    const val = Math.max(0, ds.values[i])
    if (val === 0) continue
    
    const sliceAngle = (val / total) * 2 * Math.PI
    const startX = cx + r * Math.cos(currentAngle)
    const startY = cy + r * Math.sin(currentAngle)
    const endAngle = currentAngle + sliceAngle
    const endX = cx + r * Math.cos(endAngle)
    const endY = cy + r * Math.sin(endAngle)
    
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0
    const pathData = `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
    
    slices.push({
      path: pathData,
      color: ds.color || defaultColors[i % defaultColors.length],
      label: graphData.value.labels[i] || `Item ${i+1}`,
      value: val
    })
    
    currentAngle = endAngle
  }
  
  return slices
})
</script>

<template>
  <div class="graph-widget">
    <div v-if="isEditing" class="graph-editor">
      <div class="editor-header">
        <label>Edit Graph JSON</label>
        <span v-if="jsonError" class="json-error">Invalid JSON</span>
      </div>
      <textarea 
        v-model="editJson" 
        @input="handleEditChange"
        class="graph-textarea" 
        spellcheck="false"
      ></textarea>
    </div>
    
    <div v-else class="graph-display" :class="{ 'is-mounted': isMounted }">
      <svg 
        class="chart-svg" 
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Grid Lines (Subtle) -->
        <g class="grid-lines" v-if="graphData.graphType !== 'pie'">
          <line 
            v-for="i in 5" :key="i"
            :x1="padding.left" 
            :y1="padding.top + (innerHeight / 4) * (i - 1)" 
            :x2="viewBoxWidth - padding.right" 
            :y2="padding.top + (innerHeight / 4) * (i - 1)" 
            class="grid-line"
          />
        </g>
        
        <!-- Y-Axis Labels -->
        <g class="y-axis-labels" v-if="graphData.graphType !== 'pie'">
          <text 
            v-for="i in 5" :key="i"
            :x="padding.left - 15" 
            :y="padding.top + (innerHeight / 4) * (i - 1) + 5" 
            class="axis-text"
            text-anchor="end"
          >
            {{ Math.round(maxDataValue - (maxDataValue / 4) * (i - 1)) }}
          </text>
        </g>

        <!-- X-Axis Labels -->
        <g class="x-axis-labels" v-if="graphData.graphType !== 'pie'">
          <text 
            v-for="(label, i) in graphData.labels" :key="i"
            :x="getX(i, graphData.labels.length)" 
            :y="viewBoxHeight - padding.bottom + 25" 
            class="axis-text"
            text-anchor="middle"
          >
            {{ label }}
          </text>
        </g>

        <!-- Line Chart -->
        <g v-if="graphData.graphType === 'line'">
          <template v-for="(dataset, dsIndex) in graphData.datasets" :key="dsIndex">
            <path 
              :d="generateSmoothPath(dataset.values)" 
              class="line-path" 
              :stroke="dataset.color || 'var(--accent)'"
              filter="url(#glow)"
            />
            <circle 
              v-for="(val, i) in dataset.values" :key="i"
              :cx="getX(i, dataset.values.length)" 
              :cy="getY(val)" 
              r="5" 
              class="line-point"
              :fill="dataset.color || 'var(--accent)'"
              :style="{ transitionDelay: `${i * 0.05}s` }"
            />
          </template>
        </g>

        <!-- Bar Chart -->
        <g v-else-if="graphData.graphType === 'bar'">
          <template v-for="(dataset, dsIndex) in graphData.datasets" :key="dsIndex">
            <rect 
              v-for="(val, i) in dataset.values" :key="i"
              :x="getX(i, dataset.values.length) - (barLayout.groupWidth / 2) + (dsIndex * barLayout.barWidth) + (barLayout.barWidth * 0.05)" 
              :y="isMounted ? getY(val) : padding.top + innerHeight" 
              :width="barLayout.barWidth * 0.9" 
              :height="isMounted ? padding.top + innerHeight - getY(val) : 0" 
              class="bar-rect"
              :fill="dataset.color || 'var(--accent)'"
              rx="4"
              :style="{ transitionDelay: `${i * 0.05 + dsIndex * 0.1}s` }"
            />
          </template>
        </g>

        <!-- Pie Chart -->
        <g v-else-if="graphData.graphType === 'pie'" class="pie-group">
          <g v-for="(slice, i) in pieSlices" :key="i" class="pie-slice-group" :style="{ transitionDelay: `${i * 0.1}s` }">
            <path 
              :d="slice.path" 
              :fill="slice.color" 
              class="pie-slice"
            />
          </g>
          
          <!-- Legend for Pie -->
          <g class="pie-legend">
            <g v-for="(slice, i) in pieSlices" :key="`legend-${i}`" :transform="`translate(${viewBoxWidth - 150}, ${padding.top + i * 30})`">
              <rect x="0" y="-10" width="12" height="12" rx="3" :fill="slice.color" />
              <text x="20" y="0" class="legend-text" fill="currentColor">{{ slice.label }}</text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.graph-widget {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.graph-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.json-error {
  color: var(--danger, #ef4444);
  font-size: 12px;
}

.graph-textarea {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: var(--text-primary);
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  resize: none;
  outline: none;
}

.graph-textarea:focus {
  border-color: var(--accent);
}

html.light .graph-textarea {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(0, 0, 0, 0.1);
}

/* Chart SVG Styles */
.graph-display {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

html.light .grid-line {
  stroke: rgba(0, 0, 0, 0.08);
}

.axis-text {
  fill: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
}

/* Line Chart Animations */
.line-path {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  transition: stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.is-mounted .line-path {
  stroke-dashoffset: 0;
}

.line-point {
  transform: scale(0);
  transform-origin: center;
  transform-box: fill-box;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.is-mounted .line-point {
  transform: scale(1);
}

.line-point:hover {
  transform: scale(1.5);
  cursor: crosshair;
}

/* Bar Chart Animations */
.bar-rect {
  transition: y 0.8s cubic-bezier(0.16, 1, 0.3, 1), height 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.bar-rect:hover {
  filter: brightness(1.2);
  cursor: crosshair;
}

/* Pie Chart Animations */
.pie-slice-group {
  opacity: 0;
  transform: scale(0.8);
  transform-origin: center;
  transform-box: fill-box;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.is-mounted .pie-slice-group {
  opacity: 1;
  transform: scale(1);
}

.pie-slice {
  stroke: rgba(20, 20, 22, 0.8);
  stroke-width: 2;
  transition: transform 0.3s ease;
  transform-origin: center;
  transform-box: fill-box;
}

html.light .pie-slice {
  stroke: rgba(255, 255, 255, 0.8);
}

.pie-slice:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.legend-text {
  font-size: 13px;
  font-weight: 500;
  fill: var(--text-primary);
}
</style>
