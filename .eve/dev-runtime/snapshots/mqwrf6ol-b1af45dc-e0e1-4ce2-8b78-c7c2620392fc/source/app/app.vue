<script setup lang="ts">
import { computed, ref } from 'vue'

const { status, send } = useEveAgent();

const isBusy = computed(() => status.value === "submitted" || status.value === "streaming");

const message = ref("");
const responses = ref<string[]>([]);

async function handleSubmit() {
  const text = message.value.trim();
  if (!text || isBusy.value) return;
  
  message.value = "";
  responses.value.push(`You: ${text}`);
  
  const response = await send({ message: text });
  
  if (response && response.message) {
    responses.value.push(`Eve: ${response.message}`);
  }
}
</script>

<template>
  <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
    <h1>Nuxt + Eve Agent + Ollama</h1>
    <div style="border: 1px solid #ccc; border-radius: 8px; padding: 1rem; min-height: 300px; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto;">
      <div v-if="responses.length === 0" style="color: #666; text-align: center; margin-top: auto; margin-bottom: auto;">
        Send a message to start chatting with the agent!
      </div>
      <div v-for="(msg, i) in responses" :key="i" :style="{
        padding: '0.5rem 1rem',
        borderRadius: '16px',
        backgroundColor: msg.startsWith('You:') ? '#0070f3' : '#f0f0f0',
        color: msg.startsWith('You:') ? 'white' : 'black',
        alignSelf: msg.startsWith('You:') ? 'flex-end' : 'flex-start',
        maxWidth: '80%'
      }">
        {{ msg }}
      </div>
      <div v-if="isBusy" style="color: #666; font-style: italic;">Agent is typing...</div>
    </div>
    
    <form @submit.prevent="handleSubmit" style="display: flex; gap: 0.5rem;">
      <input 
        v-model="message" 
        :disabled="isBusy" 
        placeholder="Type your message..."
        style="flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
      />
      <button 
        type="submit" 
        :disabled="isBusy"
        style="padding: 0.5rem 1rem; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
      >
        Send
      </button>
    </form>
  </div>
</template>
