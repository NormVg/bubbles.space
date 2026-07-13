<script setup lang="ts">
useSeoMeta({
  title: 'Changelog - Bubbles',
  description: 'Track the evolution of Bubbles.space. See what\'s new, what\'s fixed, and what\'s coming.',
})

const releases = [
  {
    version: 'v0.2.0',
    date: 'July 15, 2026',
    title: 'The Foundation',
    content: `
      <ul>
        <li><strong>Persistent Memory Architecture:</strong> Bubbles now remembers context across different workspaces automatically.</li>
        <li><strong>Multi-Model Canvas:</strong> Added support for querying Llama 3 and other leading open-source models side-by-side.</li>
        <li><strong>Dodo Payments Integration:</strong> Founder and Sponsor passes are now live.</li>
        <li>New landing page and manifesto.</li>
      </ul>
    `
  },
  {
    version: 'v0.1.0',
    date: 'June 2026',
    title: 'Private Beta Begins',
    content: `
      <ul>
        <li>Initial release of the spatial canvas.</li>
        <li>Basic text nodes and relationships.</li>
        <li>Google OAuth authentication.</li>
      </ul>
    `
  }
]
</script>

<template>
  <div class="changelog-page">
    <MarketingNav />
    <div class="changelog-container">

      
      <header class="changelog-header">
        <h1>Changelog</h1>
        <p class="subtitle">Building the spatial AI workspace, week by week.</p>
      </header>

      <div class="timeline">
        <article 
          v-for="(release, index) in releases" 
          :key="release.version"
          class="release-item"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <div class="release-meta">
            <span class="version">{{ release.version }}</span>
            <span class="date">{{ release.date }}</span>
          </div>
          <div class="release-content">
            <h2>{{ release.title }}</h2>
            <div class="prose" v-html="release.content"></div>
          </div>
        </article>
      </div>

    </div>
  </div>
</template>

<style scoped>
.changelog-page {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 80px 24px 120px;
}

.changelog-container {
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 64px;
  text-transform: uppercase;
  transition: color 0.2s ease;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.back-link:hover {
  color: var(--text-primary);
}

.changelog-header {
  margin-bottom: 80px;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.changelog-header h1 {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin: 0 0 16px 0;
}

.subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Timeline ── */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 64px;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 120px;
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
}

html.light .timeline::before {
  background: rgba(0, 0, 0, 0.08);
}

.release-item {
  display: flex;
  gap: 48px;
  position: relative;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.release-meta {
  width: 120px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 24px;
  position: relative;
}

/* Timeline dot */
.release-meta::after {
  content: '';
  position: absolute;
  right: -5px; /* aligns with the 1px line at left:120px */
  top: 6px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--bg-base);
  border: 1px solid var(--text-muted);
  box-sizing: border-box;
}

.version {
  display: block;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.date {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
}

.release-content {
  flex-grow: 1;
  padding-bottom: 24px;
}

.release-content h2 {
  font-size: 24px;
  font-weight: 400;
  margin: 0 0 24px 0;
  color: var(--text-primary);
}

/* ── Prose Styling for v-html ── */
.prose :deep(ul) {
  padding-left: 20px;
  margin: 0;
}

.prose :deep(li) {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.prose :deep(strong) {
  color: var(--text-primary);
  font-weight: 500;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .timeline::before {
    left: 16px;
  }
  
  .release-item {
    flex-direction: column;
    gap: 16px;
  }
  
  .release-meta {
    width: 100%;
    text-align: left;
    padding-left: 32px;
    padding-right: 0;
  }
  
  .release-meta::after {
    right: auto;
    left: 12px;
  }
  
  .release-content {
    padding-left: 32px;
  }
}
</style>
