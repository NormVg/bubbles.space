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
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="landing-content">
        <div class="avatar-wrapper">
          <AgentAvatar :state="avatarState" />
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
    <section class="marketing-section">
      <div class="marketing-grid">
        <div class="feature-card">
          <h3>Infinite Canvas</h3>
          <p>Spread your thoughts out spatially. No more scrolling up to find context.</p>
        </div>
        <div class="feature-card">
          <h3>Semantic Memory</h3>
          <p>The AI remembers you across sessions. Build a brain, not just a chat.</p>
        </div>
        <div class="feature-card">
          <h3>Multi-Model</h3>
          <p>GPT-4o, Claude 3.5, and more, working side-by-side in one space.</p>
        </div>
      </div>
      <div class="manifesto-cta-section">
        <p class="manifesto-teaser">We are moving away from linear chat.</p>
        <NuxtLink to="/manifesto" class="btn-outline">READ OUR MANIFESTO</NuxtLink>
      </div>
    </section>
    
    <footer class="landing-footer">
      <div class="footer-links">
        <NuxtLink to="/pricing">Pricing</NuxtLink>
        <NuxtLink to="/use-cases">Use Cases</NuxtLink>
        <NuxtLink to="/investors">Investors & Sponsors</NuxtLink>
        <NuxtLink to="/manifesto">Manifesto</NuxtLink>
        <NuxtLink to="/changelog">Changelog</NuxtLink>
        <NuxtLink to="/docs">Help & Docs</NuxtLink>
        <NuxtLink to="/terms">Terms</NuxtLink>
        <NuxtLink to="/privacy">Privacy</NuxtLink>
      </div>
      <p class="copyright">© 2026 Tao HQ. All rights reserved.</p>
    </footer>
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

/* ── Marketing Section ── */
.marketing-section {
  padding: 80px 24px;
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.marketing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 12px 0;
  color: var(--text-primary);
}

.feature-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

.manifesto-cta-section {
  text-align: center;
  padding: 80px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

html.light .manifesto-cta-section {
  border-color: rgba(0, 0, 0, 0.08);
}

.manifesto-teaser {
  font-size: 24px;
  font-weight: 300;
  color: var(--text-primary);
  margin: 0 0 32px 0;
}

.btn-outline {
  display: inline-flex;
  padding: 12px 24px;
  border: 1px solid var(--text-primary);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background: var(--text-primary);
  color: var(--bg-base);
}

/* ── Footer ── */
.landing-footer {
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

html.light .landing-footer {
  border-color: rgba(0, 0, 0, 0.04);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.footer-links a {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.footer-links a:hover {
  opacity: 1;
}

.copyright {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
}
</style>
