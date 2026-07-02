<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
import { ref } from 'vue'
import { LogIn } from 'lucide-vue-next'

const isLoading = ref(false)

async function loginWithGoogle() {
  isLoading.value = true
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/app"
  })
}
</script>

<template>
  <div class="landing-container">
    <div class="glow-bg"></div>
    <div class="content">
      <div class="brand">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="logo">
          <defs>
            <radialGradient id="bubble" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
              <stop offset="25%" stop-color="#e2f1ff" stop-opacity="0.7" />
              <stop offset="70%" stop-color="#90c2ff" stop-opacity="0.4" />
              <stop offset="95%" stop-color="#5096ff" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#2070ff" stop-opacity="1" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#bubble)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.6" />
          <path d="M 25 35 Q 40 15 65 25 Q 45 25 25 35" fill="#ffffff" opacity="0.9" />
          <circle cx="72" cy="65" r="4" fill="#ffffff" opacity="0.6" />
        </svg>
        <h1>Bubbles</h1>
      </div>
      <p class="tagline">Your AI-powered thinking canvas.</p>
      
      <button class="login-btn" @click="loginWithGoogle" :disabled="isLoading">
        <LogIn v-if="!isLoading" class="icon" :size="18" />
        <span v-if="isLoading" class="spinner"></span>
        {{ isLoading ? 'Connecting...' : 'Continue with Google' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000; /* Sleek dark mode */
  position: relative;
  overflow: hidden;
  font-family: var(--font-sans);
}

.glow-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgba(32,112,255,0.15) 0%, rgba(0,0,0,0) 70%);
  z-index: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.logo {
  width: 48px;
  height: 48px;
}

h1 {
  font-size: 42px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -1px;
  margin: 0;
}

.tagline {
  font-size: 18px;
  color: #888;
  margin: 0 0 48px 0;
  letter-spacing: -0.2px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
}

.login-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.login-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
