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
    <section class="marketing-section">
      <div class="marketing-grid">
        <div class="feature-card">
          <div class="feature-icon spatial-icon"></div>
          <h3>Spatial Canvas</h3>
          <p>Spread your thoughts out spatially. No more scrolling up to find context.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon memory-icon"></div>
          <h3>Semantic Memory</h3>
          <p>The AI remembers you across sessions. Build a brain, not just a chat.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon model-icon"></div>
          <h3>Multi-Model</h3>
          <p>Llama 3, Mistral, and other leading open-source models working side-by-side.</p>
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
      <p class="copyright">© 2026 TheAlphaOnes. All rights reserved.</p>
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

/* ── Premium Bento Box Section ── */
.marketing-section {
  padding: 120px 24px;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 120px;
}

.marketing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.0) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

html.light .feature-card {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.0) 100%);
  border-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.02);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
}

html.light .feature-card::before {
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
}

.feature-card:hover {
  transform: translateY(-4px) scale(1.01);
  border-color: rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
}

html.light .feature-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.01) 100%);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.06);
}

.feature-card:hover::before {
  opacity: 1;
}

/* Abstract Icons for premium feel */
.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

html.light .feature-icon {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}

.spatial-icon::after {
  content: '';
  position: absolute;
  width: 40%;
  height: 40%;
  border-radius: 4px;
  border: 2px solid var(--text-primary);
  transform: rotate(45deg);
}

.memory-icon::after {
  content: '';
  position: absolute;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: var(--text-primary);
  box-shadow: 0 0 20px var(--text-primary);
}

.model-icon::after, .model-icon::before {
  content: '';
  position: absolute;
  width: 20%;
  height: 20%;
  border-radius: 50%;
  border: 2px solid var(--text-primary);
}
.model-icon::after { transform: translateX(-12px); }
.model-icon::before { transform: translateX(12px); }

.feature-card h3 {
  font-size: 18px;
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

@media (max-width: 768px) {
  .marketing-section {
    padding: 80px 24px;
    gap: 80px;
  }
  .marketing-grid {
    grid-template-columns: 1fr;
  }
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
