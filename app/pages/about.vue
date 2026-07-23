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
          Bubbles.space is your persistent AI assistant for the new era of computing—a presence that's always running, remembers everything, and helps you work naturally instead of juggling apps, notes, and endless tabs.
        </p>
      </div>
    </div>

    <!-- Vision and Philosophy -->
    <section class="content-section">
      <div class="content-block">
        <h2 class="block-title">The Philosophy</h2>
        <p class="block-text">
          Software today is fragmented. People spend their days switching between apps, managing tabs, copying information between tools, and manually coordinating their digital lives. AI has made software more capable, but most AI products still operate in a simple loop: You ask. It responds.
        </p>
        <p class="block-text">
          We believe the next generation of computing will be fundamentally different. It will be persistent, context-aware, proactive, and agent-driven.
        </p>
        <p class="block-text highlight-text">
          Our vision is a new computing layer: a personal AI that lives alongside you and quietly helps run your digital life.
        </p>
      </div>

      <div class="content-block">
        <h2 class="block-title">The Ecosystem</h2>
        <p class="block-text">
          Bubbles is not a single application. We are building an ecosystem of agent-first applications, each designed to be valuable on its own while becoming exponentially more powerful together. Every application contributes context, memory, and intelligence back into the Bubbles platform.
        </p>
        <div class="list-grid">
          <div class="list-column">
            <h3>Core Principles</h3>
            <ul>
              <li>Persistent memory and state</li>
              <li>Cross-device synchronization</li>
              <li>Deep personal context</li>
              <li>Proactive intelligence</li>
              <li>Human-in-the-loop control</li>
              <li>Privacy and user ownership</li>
            </ul>
          </div>
          <div class="list-column">
            <h3>Capabilities</h3>
            <ul>
              <li>AI-native spatial workspace</li>
              <li>Personal memory engine</li>
              <li>Autonomous agents</li>
              <li>Context engine</li>
              <li>Cross-application intelligence</li>
              <li>Extensible APIs</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- The Features Section -->
    <section class="marketing-section">
      <LandingFeatures />
      
      <div class="manifesto-cta-section">
        <p class="manifesto-teaser">We are moving away from linear chat.</p>
        <NuxtLink to="/manifesto" class="btn-outline">READ THE FULL MANIFESTO</NuxtLink>
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

/* ── Content Sections ── */
.content-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.content-block {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.block-title {
  font-size: 24px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

html.light .block-title {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.block-text {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

.highlight-text {
  font-size: 18px;
  color: var(--text-primary);
  font-style: italic;
  padding-left: 16px;
  border-left: 2px solid var(--text-primary);
  margin-top: 12px;
}

.list-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 24px;
}

@media (max-width: 640px) {
  .list-grid {
    grid-template-columns: 1fr;
  }
}

.list-column h3 {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.list-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-column li {
  font-size: 14px;
  color: var(--text-secondary);
  position: relative;
  padding-left: 16px;
}

.list-column li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--text-primary);
  opacity: 0.5;
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
