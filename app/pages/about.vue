<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
</script>

<template>
  <div class="landing-screen">
    <MarketingNav />
    
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="landing-content">
        <h1 class="hero-title">About Bubbles</h1>
        <p class="hero-subtitle">
          We built Bubbles because linear chat is a bottleneck for complex ideas. By combining a spatial canvas with semantic memory, we're giving you a persistent workspace that evolves alongside your thinking.
        </p>
      </div>
    </div>

    <!-- The Features Section -->
    <section class="marketing-section">
      <LandingFeatures />
      
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
  padding: 180px 24px 60px;
  display: flex;
  justify-content: center;
}

.landing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 800px;
  text-align: center;
  animation: fade-in 1s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  font-size: 40px;
  font-weight: 300;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.hero-subtitle {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Premium Bento Box Section ── */
.marketing-section {
  padding: 60px 24px 120px;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 120px;
}

@media (max-width: 768px) {
  .marketing-section {
    padding: 40px 24px 80px;
    gap: 80px;
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
