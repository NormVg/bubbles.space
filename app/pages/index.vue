<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
import { ref } from 'vue'
import BubblesAvatar from '~/components/BubblesAvatar.vue'

const isLoading = ref(false)
const config = useRuntimeConfig()
const isLocked = config.public.appLocked

async function loginWithGoogle() {
  isLoading.value = true
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/app"
  })
}
</script>

<template>
  <div class="landing-screen">
    <MarketingNav />
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="landing-content">
        <div class="avatar-wrapper">
          <BubblesAvatar :interactive="true" :trackCursor="true" />
        </div>
        
        <div class="logo-wrapper">
          <h1 class="logo-text">BUBBLES</h1>
        </div>
        
        <p class="tagline">Your persistent AI workspace.</p>
        
        <div class="auth-section">
          <button class="login-btn" @click="loginWithGoogle" :disabled="isLoading">
            <span v-if="isLoading" class="loader-track">
              <span class="loader-fill"></span>
            </span>
            <span v-else class="btn-text">{{ isLocked ? 'JOIN THE WAITLIST' : 'CONTINUE WITH GOOGLE' }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Investor Link at bottom -->
    <div class="investor-footer">
      <NuxtLink to="/investors" class="investor-link" title="Investors & Sponsors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.landing-screen {
  position: absolute;
  inset: 0;
  background-color: var(--bg-base);
  font-family: var(--font-sans);
  overflow-y: auto;
  scroll-behavior: smooth;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.landing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: fade-in 1s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.avatar-wrapper {
  margin-bottom: -8px; /* Pull the text slightly closer to the avatar */
  transform: scale(1.2); /* Make the avatar a bit larger for the landing page */
}

.logo-wrapper {
  overflow: hidden;
}

.logo-text {
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 12px;
  margin-right: -12px;
  color: var(--text-primary);
  margin-top: 0;
  margin-bottom: 0;
}

html.light .logo-text {
  font-weight: 400;
}

.tagline {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 1px;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin: 0 0 32px 0;
  opacity: 0.6;
}

.auth-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.login-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 2px;
  cursor: pointer;
  padding: 8px 16px;
  opacity: 0.6;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  min-height: 32px;
}

.login-btn:hover:not(:disabled) {
  opacity: 1;
}

.login-btn:disabled {
  cursor: not-allowed;
}

.btn-text {
  position: relative;
}

.btn-text::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--text-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.login-btn:hover .btn-text::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Loader styles adapted from splash screen */
.loader-track {
  width: 120px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  display: block;
}

html.light .loader-track {
  background: rgba(0, 0, 0, 0.1);
}

.loader-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--text-primary);
  width: 30%;
  animation: indeterminate-load 1s infinite linear;
  transform-origin: left;
}

@keyframes indeterminate-load {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

.investor-footer {
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.investor-link {
  color: var(--text-secondary);
  opacity: 0.4;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

html.light .investor-link {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.05);
}

.investor-link:hover {
  opacity: 1;
  color: var(--text-primary);
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

html.light .investor-link:hover {
  background: rgba(0, 0, 0, 0.08);
}

</style>
