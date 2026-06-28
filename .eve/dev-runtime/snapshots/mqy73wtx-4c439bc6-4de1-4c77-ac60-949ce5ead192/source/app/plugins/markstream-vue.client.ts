import { defineNuxtPlugin } from '#app'
import MarkdownRender, { enableMermaid, enableKatex, setCustomComponents, MarkdownCodeBlockNode } from 'markstream-vue'
import 'markstream-vue/index.css'
import 'katex/dist/katex.min.css'

export default defineNuxtPlugin((nuxtApp) => {
  enableMermaid()
  enableKatex()
  setCustomComponents({
    code_block: MarkdownCodeBlockNode
  })
  nuxtApp.vueApp.component('MarkdownRender', MarkdownRender)
})
