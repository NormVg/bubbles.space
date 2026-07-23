<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isLoaded = ref(false)

onMounted(() => {
  // Trigger entry animations after a brief tick
  setTimeout(() => {
    isLoaded.value = true
  }, 50)
})
</script>

<template>
  <div class="about-screen">
    <!-- Ambient Background Effects -->
    <div class="ambient-bg">
      <div class="ambient-orb orb-1"></div>
      <div class="ambient-orb orb-2"></div>
      <div class="ambient-orb orb-3"></div>
      <div class="noise-overlay"></div>
    </div>

    <MarketingNav />
    
    <main class="about-main" :class="{ 'is-loaded': isLoaded }">
      <!-- Hero Section -->
      <section class="about-hero">
        <div class="hero-label">OUR VISION</div>
        <h1 class="hero-title">A new dimension<br/>for your thoughts.</h1>
        <p class="hero-subtitle">
          We built Bubbles because linear chat is a bottleneck for complex ideas. 
          By combining a spatial canvas with semantic memory, we're giving you a persistent 
          workspace that evolves alongside your thinking.
        </p>
      </section>

      <!-- The Features Section -->
      <section class="marketing-section">
        <div class="section-heading">
          <h2 class="section-title">The Foundation</h2>
          <p class="section-desc">The core primitives that power a better workflow.</p>
        </div>
        <LandingFeatures />
      </section>
      
      <!-- Manifesto CTA -->
      <section class="manifesto-cta-section">
        <div class="glass-panel">
          <h2 class="manifesto-teaser">We are moving away from linear chat.</h2>
          <p class="manifesto-desc">
            Discover the philosophy behind our design decisions and why we believe 
            the future of human-computer interaction is spatial.
          </p>
          <NuxtLink to="/manifesto" class="btn-primary">
            READ OUR MANIFESTO
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </NuxtLink>
        </div>
      </section>
    </main>
    
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
.about-screen {
  position: absolute;
  inset: 0;
  background-color: var(--bg-base);
  font-family: var(--font-sans);
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* ── Ambient Background ── */
.ambient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  animation: float 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: var(--text-primary);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: #3b82f6; /* Subtle blue */
  bottom: 10%;
  right: -5%;
  animation-delay: -5s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: #8b5cf6; /* Subtle purple */
  top: 40%;
  left: 40%;
  animation-delay: -10s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5%, 5%) scale(1.05); }
  66% { transform: translate(-2%, 8%) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.025;
  mix-blend-mode: overlay;
}

/* ── Layout & Core ── */
.about-main {
  position: relative;
  z-index: 1;
  padding-top: 120px;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 160px;
  padding-bottom: 120px;
}

@media (max-width: 768px) {
  .about-main {
    gap: 80px;
    padding-top: 100px;
  }
}

/* ── Entry Animations ── */
.about-hero, .marketing-section, .manifesto-cta-section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.is-loaded .about-hero {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.is-loaded .marketing-section {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.3s;
}

.is-loaded .manifesto-cta-section {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.4s;
}

/* ── Hero Section ── */
.about-hero {
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 64px;
}

.hero-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 24px;
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
}

html.light .hero-label {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
}

.hero-title {
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0 0 32px 0;
  background: linear-gradient(180deg, var(--text-primary) 0%, rgba(255, 255, 255, 0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

html.light .hero-title {
  background: linear-gradient(180deg, var(--text-primary) 0%, rgba(0, 0, 0, 0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.6;
  font-weight: 400;
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0;
}

/* ── Features Section ── */
.marketing-section {
  padding: 0 24px;
}

.section-heading {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: 32px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  letter-spacing: -0.01em;
}

.section-desc {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Manifesto CTA ── */
.manifesto-cta-section {
  padding: 0 24px;
}

.glass-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  position: relative;
  overflow: hidden;
}

html.light .glass-panel {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.05);
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
}

html.light .glass-panel::before {
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
}

.manifesto-teaser {
  font-size: clamp(24px, 4vw, 40px);
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  margin: 0 0 24px 0;
}

.manifesto-desc {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 0 48px 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--text-primary);
  color: var(--bg-base);
  border-radius: 100px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
}

html.light .btn-primary:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon {
  transform: translateX(4px);
}

/* ── Footer ── */
.landing-footer {
  position: relative;
  z-index: 1;
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
