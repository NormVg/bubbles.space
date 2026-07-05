<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useWidgetStore } from '../../../stores/widgets'

const props = defineProps<{
  data: {
    xml?: string // The raw XML of the draw.io diagram
    mermaid?: string // Optional mermaid string to seed the diagram
  }
  isEditing?: boolean
  id: string
}>()

const emit = defineEmits<{
  (e: 'save', data: any): void
}>()

const widgetStore = useWidgetStore()
const iframeRef = ref<HTMLIFrameElement | null>(null)
const isLoading = ref(true)

// Configure draw.io embed URL
// proto=json: JSON protocol for postMessage
// modified=0: Handle modified state internally
// keepmodified=0: Don't keep modified state after save
// libraries=1: Enable shape libraries
// ui=min: Minimal UI (optional, we'll use default dark/light mode depending on theme)
const drawioUrl = 'https://embed.diagrams.net/?embed=1&proto=json&spin=1&libraries=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1'

const handleMessage = (event: MessageEvent) => {
  // Ensure the message is from our iframe
  if (event.source !== iframeRef.value?.contentWindow) return

  try {
    const msg = JSON.parse(event.data)
    
    if (msg.event === 'init') {
      isLoading.value = false
      // Load the diagram data when draw.io is ready
      // If the AI seeded the widget with Mermaid, we use the descriptor format
      if (props.data.mermaid) {
        iframeRef.value?.contentWindow?.postMessage(JSON.stringify({
          action: 'load',
          descriptor: { format: 'mermaid', data: props.data.mermaid, wrap: true },
          autosave: 1, // Enable autosave so we get real-time updates
          title: 'Canvas Drawing'
        }), '*')
      } else {
        iframeRef.value?.contentWindow?.postMessage(JSON.stringify({
          action: 'load',
          xml: props.data.xml || '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>',
          autosave: 1, // Enable autosave so we get real-time updates
          title: 'Canvas Drawing'
        }), '*')
      }
    } 
    else if (msg.event === 'autosave' || msg.event === 'save') {
      // Save the XML back to our store
      // Note: Even if it was seeded with Mermaid, autosave returns raw draw.io XML
      // We will overwrite the data object to only have xml going forward.
      if (msg.xml) {
        emit('save', { xml: msg.xml })
      }
    }
  } catch (e) {
    // Ignore non-JSON messages or parse errors
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="drawio-widget" :class="{ 'is-editing': isEditing }">
    <!-- Mask overlay to capture pointer events during drag/edit mode -->
    <div v-if="isEditing" class="interaction-mask">
      <div class="mask-content">
        <LucidePenTool :size="24" />
        <span>Editing Mode Active</span>
        <p>Exit edit mode to interact with the drawing.</p>
      </div>
    </div>
    
    <div class="iframe-container">
      <div v-if="isLoading" class="loader-overlay">
        <div class="spinner"></div>
      </div>
      <iframe
        ref="iframeRef"
        :src="drawioUrl"
        class="drawio-iframe"
        frameborder="0"
        title="Draw.io Editor"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.drawio-widget {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  overflow: hidden;
  border-radius: 12px;
}

.iframe-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.drawio-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: white; /* Draw.io handles its own dark mode via config, but defaults to white canvas */
}

/* 
  When the widget is in "edit mode" (being dragged or resized by the canvas),
  we overlay a transparent mask so the iframe doesn't swallow pointer events.
*/
.interaction-mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.mask-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.mask-content span {
  font-weight: 500;
  font-size: 14px;
}

.mask-content p {
  font-size: 12px;
  opacity: 0.8;
  margin: 0;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  z-index: 5;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
