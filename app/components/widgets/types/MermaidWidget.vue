<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import mermaid from 'mermaid'
import { useDark } from '@vueuse/core'

const props = defineProps<{
  data: Record<string, any>
}>()

const isDark = useDark()
const svgContent = ref('')
const isRendering = ref(false)

const renderChart = async () => {
  if (isRendering.value) return
  isRendering.value = true
  
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark.value ? 'dark' : 'default',
      securityLevel: 'loose',
      background: 'transparent',
      fontFamily: 'inherit'
    })
    
    // Generate unique ID for this render
    const id = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`
    const source = props.data.chart || 'graph TD; A-->B;'
    
    const { svg } = await mermaid.render(id, source)
    svgContent.value = svg
  } catch (e) {
    console.error('Mermaid render error', e)
    // Try to fallback to a basic error display
    svgContent.value = `<div style="color: #e74c3c; padding: 20px; text-align: center;">Failed to render diagram.<br><span style="font-size: 12px; opacity: 0.7;">Syntax error in Mermaid code.</span></div>`
  } finally {
    isRendering.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    renderChart()
  })
})

watch(() => isDark.value, renderChart)
watch(() => props.data.chart, renderChart)
</script>

<template>
  <div class="mermaid-widget-content" v-html="svgContent"></div>
</template>

<style scoped>
.mermaid-widget-content {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Force the natively rendered mermaid SVG to scale perfectly */
.mermaid-widget-content :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain;
}
</style>
