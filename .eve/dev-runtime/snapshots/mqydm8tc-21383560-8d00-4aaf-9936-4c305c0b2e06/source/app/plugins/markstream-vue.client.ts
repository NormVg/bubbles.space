import { defineNuxtPlugin } from '#app'
import MarkdownRender, { enableMermaid, enableKatex } from 'markstream-vue'
import 'markstream-vue/index.css'
import 'katex/dist/katex.min.css'

export default defineNuxtPlugin((nuxtApp) => {
  enableMermaid()
  enableKatex()
  nuxtApp.vueApp.component('MarkdownRender', MarkdownRender)
})
