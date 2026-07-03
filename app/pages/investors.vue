<template>
  <div class="legal-page">
    <div class="legal-container">
      <div class="legal-header">
        <NuxtLink to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Bubbles
        </NuxtLink>
      </div>

      <div class="md-content">
        <div class="line"># Bubbles: A Spatial AI Workspace</div>
        <br>
        <div class="line muted">// THE PHILOSOPHY</div>
        <div class="line">We are not building another generic chat interface wrapper.</div>
        <div class="line">We are building a persistent, spatial intelligence layer for your desktop.</div>
        <div class="line">We believe that AI should live alongside you, contextually aware, rather than trapped in a browser tab.</div>
        <br>
        <div class="line muted">// THE PRODUCT</div>
        <div class="line">Bubbles is a heavy, interactive desktop-grade canvas built for buttery-smooth 60fps performance.</div>
        <div class="line">It is a reactive entity. It is alive.</div>
        <br>
        <div class="line muted">// WHAT WE EXPECT FROM A PARTNER</div>
        <div class="line">We are not looking for "dumb money". We are looking for visionary partners who understand deep architecture, zero-latency local-first systems, and long-term bets. If you just want a quick ARR flip, this is not for you.</div>
        <div class="line">- You understand technical debt and why we refuse it.</div>
        <div class="line">- You have a thesis on spatial computing and AI.</div>
        <div class="line">- You let founders build.</div>
        <br>
        <div class="line muted">// THE ASK</div>
        <div class="line">We are currently accepting a limited number of early backers to fund our runway.</div>
        <br>
        <div class="line">### [1] Founder's Pass ($49)</div>
        <div class="line">- Instant access to the private beta.</div>
        <div class="line">- Lifetime Pro Status (no subscriptions).</div>
        <div class="line">- Access to the private developer group.</div>
        <div class="line"><a href="#" class="md-link">[Purchase Access]</a></div>
        <br>
        <div class="line">### [2] Early Backer / Sponsor ($500+)</div>
        <div class="line">- All perks of the Founder's Pass.</div>
        <div class="line">- Direct line to the core engineering team.</div>
        <div class="line">- Priority feature requests.</div>
        <div class="line"><a href="#" class="md-link">[Become a Sponsor]</a></div>
        <br>
        <div class="line">### [3] Angel Investor (Custom)</div>
        <div class="line">- Equity discussions.</div>
        <div class="line">- Deep architectural access and early API integrations.</div>
        <div class="line"><a href="mailto:founders@tao.hq" class="md-link">[Initialize Contact]</a></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Inherit the exact layout from terms.vue */
.legal-page {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 80px 24px;
}

.legal-container {
  max-width: 680px;
  margin: 0 auto;
}

.legal-header {
  margin-bottom: 48px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-primary);
}

/* Specific Markdown Styling */
.md-content {
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary);
}

.line {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.line.muted {
  color: var(--text-secondary);
  opacity: 0.7;
}

.md-link {
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-color: var(--text-secondary);
  text-underline-offset: 4px;
  transition: opacity 0.2s ease;
}

.md-link:hover {
  opacity: 0.7;
}
</style>
