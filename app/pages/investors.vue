<template>
  <div class="manifesto-page">
    <div class="manifesto-container">
      <div class="editor-content">
        <span class="line"><span class="h1"># Bubbles: A Spatial AI Workspace</span></span>
        <span class="line empty"></span>
        <span class="line"><span class="comment">// THE PHILOSOPHY</span></span>
        <span class="line">We are not building another generic chat interface wrapper. We are</span>
        <span class="line">building a persistent, spatial intelligence layer for your desktop.</span>
        <span class="line">We believe that AI should live alongside you, contextually aware,</span>
        <span class="line">rather than trapped in a browser tab.</span>
        <span class="line empty"></span>
        <span class="line"><span class="comment">// THE PRODUCT</span></span>
        <span class="line">Bubbles is a heavy, interactive desktop-grade canvas built for</span>
        <span class="line">buttery-smooth 60fps performance. It is a reactive entity.</span>
        <span class="line">It is alive.</span>
        <span class="line empty"></span>
        <span class="line"><span class="comment">// WHAT WE EXPECT FROM A PARTNER</span></span>
        <span class="line">We are not looking for "dumb money". We are looking for visionary</span>
        <span class="line">partners who understand deep architecture, zero-latency local-first</span>
        <span class="line">systems, and long-term bets. If you just want a quick ARR flip,</span>
        <span class="line">this is not for you.</span>
        <span class="line"><span class="list-item">- You understand technical debt and why we refuse it.</span></span>
        <span class="line"><span class="list-item">- You have a thesis on spatial computing and AI.</span></span>
        <span class="line"><span class="list-item">- You let founders build.</span></span>
        <span class="line empty"></span>
        <span class="line"><span class="comment">// THE ASK</span></span>
        <span class="line">We are currently accepting a limited number of early backers to</span>
        <span class="line">fund our runway.</span>
        <span class="line empty"></span>
        <span class="line"><span class="h3">### [1] Founder's Pass ($49)</span></span>
        <span class="line"><span class="list-item">- Instant access to the private beta.</span></span>
        <span class="line"><span class="list-item">- Lifetime Pro Status (no subscriptions).</span></span>
        <span class="line"><span class="list-item">- Access to the private developer group.</span></span>
        <span class="line"><a href="#" class="md-link">[Purchase Access]</a></span>
        <span class="line empty"></span>
        <span class="line"><span class="h3">### [2] Early Backer / Sponsor ($500+)</span></span>
        <span class="line"><span class="list-item">- All perks of the Founder's Pass.</span></span>
        <span class="line"><span class="list-item">- Direct line to the core engineering team.</span></span>
        <span class="line"><span class="list-item">- Priority feature requests.</span></span>
        <span class="line"><a href="#" class="md-link">[Become a Sponsor]</a></span>
        <span class="line empty"></span>
        <span class="line"><span class="h3">### [3] Angel Investor (Custom)</span></span>
        <span class="line"><span class="list-item">- Equity discussions.</span></span>
        <span class="line"><span class="list-item">- Deep architectural access and early API integrations.</span></span>
        <span class="line"><a href="mailto:founders@tao.hq" class="md-link">[Initialize Contact]</a></span>
        <span class="line empty"></span>
        <span class="line">---</span>
        <span class="line empty"></span>
        <span class="line"><NuxtLink to="/" class="md-link">[&lt;- Back to Bubbles]</NuxtLink></span>
        <span class="line empty"></span>
        <span class="line cursor"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manifesto-page {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background-color: #050505; /* Deep, terminal-like black */
  color: #E2E8F0; /* Clean, slightly muted white */
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace;
  padding: 80px 24px;
}

html.light .manifesto-page {
  background-color: #F8FAFC;
  color: #334155;
}

.manifesto-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: fade-in 0.8s ease-out forwards;
}

html.light .manifesto-container {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.editor-content {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.6;
}

.line {
  display: block;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.line.empty {
  height: 22.4px; /* Matches line-height (14px * 1.6) */
}

.h1 {
  color: #38BDF8; /* Sky blue for main heading */
  font-weight: 700;
  font-size: 16px;
}

html.light .h1 {
  color: #0284C7;
}

.h3 {
  color: #A855F7; /* Purple for subheadings */
  font-weight: 600;
}

html.light .h3 {
  color: #7E22CE;
}

.comment {
  color: #64748B; /* Slate grey for comments */
  font-style: italic;
}

html.light .comment {
  color: #94A3B8;
}

.list-item {
  color: #CBD5E1;
}

html.light .list-item {
  color: #475569;
}

.md-link {
  color: #10B981; /* Emerald green for links */
  text-decoration: none;
  transition: opacity 0.2s ease, text-shadow 0.2s ease;
  display: inline-block;
  cursor: pointer;
}

html.light .md-link {
  color: #059669;
}

.md-link:hover {
  opacity: 0.8;
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

html.light .md-link:hover {
  text-shadow: none;
  text-decoration: underline;
}

/* Blinking cursor effect at the end */
.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: #E2E8F0;
  margin-top: 8px;
  animation: blink 1s step-end infinite;
}

html.light .cursor {
  background-color: #334155;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 600px) {
  .manifesto-container {
    padding: 24px;
  }
  .editor-content {
    font-size: 13px;
  }
}
</style>
