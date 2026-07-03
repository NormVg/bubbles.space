<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
import { ref } from 'vue'
import BubblesAvatar from '~/components/BubblesAvatar.vue'

const isLoading = ref(false)
const { data: session } = authClient.useSession()

async function signOut() {
  isLoading.value = true
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = '/'
      }
    }
  })
}
</script>

<template>
  <div class="waitlist-screen">
    <div class="waitlist-content">
      <div class="avatar-wrapper">
        <BubblesAvatar :interactive="true" :trackCursor="true" emotionOverride="happy" />
      </div>
      
      <div class="message-container">
        <h1 class="logo-text">YOU'RE ON THE LIST</h1>
        <p class="tagline">BUBBLES IS NOT PUBLICLY LIVE YET.</p>
        
        <p class="sub-text">
          Thank you for registering! We have secured your spot.<br>
          We will notify you at <strong class="email-highlight">{{ session?.user?.email }}</strong> when access is granted.
        </p>
      </div>

      <div class="founders-card">
        <div class="founders-header">
          <span class="founders-badge">EARLY ADOPTER</span>
          <h2>Unlock Instant Access</h2>
          <p>Become a Founding Member to bypass the waitlist immediately.</p>
        </div>
        
        <ul class="perks-list">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Instant access to the private beta
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Lifetime Pro Status (No subscriptions)
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Access to the private developer group
          </li>
        </ul>

        <a href="#" class="buy-button">Get Founder's Pass - $49</a>
      </div>
      
      
      <div class="auth-section">
        <button class="signout-btn" @click="signOut" :disabled="isLoading">
          <span v-if="isLoading" class="loader-track">
            <span class="loader-fill"></span>
          </span>
          <span v-else class="btn-text">SIGN OUT</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.waitlist-screen {
  position: absolute;
  inset: 0;
  background-color: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
}

.waitlist-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  animation: fade-in 1s ease-out forwards;
  max-width: 480px;
  text-align: center;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.avatar-wrapper {
  transform: scale(1.2);
}

.message-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.logo-text {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 4px;
  color: var(--text-primary);
  margin: 0;
}

html.light .logo-text {
  font-weight: 400;
}

.tagline {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin: 0;
}

.sub-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  opacity: 0.8;
  margin-top: 8px;
}

.email-highlight {
  color: var(--text-primary);
  font-weight: 500;
}

.auth-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
}

.signout-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
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
  min-width: 140px;
  min-height: 32px;
}

.signout-btn:hover:not(:disabled) {
  opacity: 1;
  color: var(--text-primary);
}

.signout-btn:disabled {
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

.signout-btn:hover .btn-text::after {
  transform: scaleX(1);
  transform-origin: left;
}

.loader-track {
  width: 100px;
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

/* Founder's Pass Card */
.founders-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  text-align: left;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  margin-top: 16px;
}

html.light .founders-card {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.founders-header {
  margin-bottom: 24px;
}

.founders-badge {
  display: inline-block;
  background: var(--text-primary);
  color: var(--bg-base);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.founders-header h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.founders-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.perks-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.perks-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.perks-list svg {
  width: 16px;
  height: 16px;
  color: #A855F7;
  flex-shrink: 0;
}

.buy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--text-primary);
  color: var(--bg-base);
  text-decoration: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 0.2s ease, opacity 0.2s ease;
  width: 100%;
}

.buy-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
