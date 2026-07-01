import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const emotion = ref('normal')
  
  function setEmotion(newEmotion: string) {
    emotion.value = newEmotion
  }

  return { emotion, setEmotion }
})
