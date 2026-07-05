import { defineAsyncComponent } from 'vue'

export const WidgetRegistry: Record<string, any> = {
  markdown: defineAsyncComponent(() => import('./types/MarkdownWidget.vue')),
  mermaid: defineAsyncComponent(() => import('./types/MermaidWidget.vue')),
  timer: defineAsyncComponent(() => import('./types/TimerWidget.vue')),
  graph: defineAsyncComponent(() => import('./types/GraphWidget.vue')),
  image: defineAsyncComponent(() => import('./types/ImageWidget.vue')),
  pdf: defineAsyncComponent(() => import('./types/PdfWidget.vue')),
}
