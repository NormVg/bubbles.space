<script setup lang="ts">
import type { NuxtError } from '#app'
import { clearError } from '#app'
import BubblesAvatar from '~/components/BubblesAvatar.vue'
import { computed } from 'vue'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

const statusCode = computed(() => props.error?.statusCode || 404)
const statusMessage = computed(() => {
  if (props.error?.statusMessage) return props.error.statusMessage.toUpperCase()
  if (statusCode.value === 404) return 'PAGE NOT FOUND'
  return 'AN ERROR OCCURRED'
})
</script>

<template>
  <div class="landing-screen">
    <div class="landing-content">
      <div class="avatar-wrapper">
        <BubblesAvatar :interactive="false" />
      </div>
      <div class="logo-wrapper">
        <h1 class="logo-text">{{ statusCode }}</h1>
      </div>
      
      <p class="tagline">{{ statusMessage }}</p>
      
      <div class="auth-section">
        <button class="login-btn" @click="handleError">
          <span class="btn-text">RETURN TO WORKSPACE</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-screen {
  position: absolute;
  inset: 0;
  background-color: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
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
  margin-bottom: -8px;
  transform: scale(1.2);
  filter: hue-rotate(15deg) saturate(0.8);
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

.login-btn:hover {
  opacity: 1;
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
</style>
