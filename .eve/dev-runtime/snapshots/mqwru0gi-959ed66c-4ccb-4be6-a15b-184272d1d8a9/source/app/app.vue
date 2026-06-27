<script setup lang="ts">
import { computed, ref } from 'vue'

const { data, status, send } = useEveAgent();

const isBusy = computed(() => status.value === "submitted" || status.value === "streaming");

const message = ref("");

async function handleSubmit() {
  const text = message.value.trim();
  if (!text || isBusy.value) return;
  
  message.value = "";
  // `send` adds the message to `data.messages` directly and streams the response
  await send({ message: text });
}
</script>

<template>
  <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
    <h1>Nuxt + Eve Agent + Ollama</h1>
    <div style="border: 1px solid #ccc; border-radius: 8px; padding: 1rem; min-height: 300px; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto;">
      <div v-if="!data?.messages?.length" style="color: #666; text-align: center; margin-top: auto; margin-bottom: auto;">
        Send a message to start chatting with the agent!
      </div>
      
      <template v-for="msg in data?.messages" :key="msg.id">
        <!-- Render each part of the message -->
        <div v-for="(part, idx) in msg.parts" :key="idx" :style="{
          padding: '0.5rem 1rem',
          borderRadius: '16px',
          backgroundColor: msg.role === 'user' ? '#0070f3' : '#f0f0f0',
          color: msg.role === 'user' ? 'white' : 'black',
          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
          maxWidth: '80%'
        }">
          <template v-if="part.type === 'text'">
            {{ part.text }}
          </template>
          <template v-else-if="part.type === 'error'">
            <span style="color: red">Error: {{ part.error.message }}</span>
          </template>
          <template v-else>
            <!-- Handle other part types if needed -->
            <em>[{{ part.type }}]</em>
          </template>
        </div>
      </template>

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
