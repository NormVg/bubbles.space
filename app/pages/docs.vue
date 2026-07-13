<script setup lang="ts">
useSeoMeta({
  title: 'Help & Docs - Bubbles',
  description: 'Learn how to use Bubbles.space, keyboard shortcuts, and manage your persistent memory.',
})

const sections = [
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'shortcuts', title: 'Keyboard Shortcuts' },
  { id: 'memory', title: 'How Memory Works' },
]

const activeSection = ref('getting-started')

function scrollTo(id: string) {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="docs-page">
    <MarketingNav />
    <div class="docs-container">
      
      <aside class="docs-sidebar">
        <NuxtLink to="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </NuxtLink>
        
        <nav class="sidebar-nav">
          <button 
            v-for="section in sections" 
            :key="section.id"
            @click="scrollTo(section.id)"
            class="nav-item"
            :class="{ active: activeSection === section.id }"
          >
            {{ section.title }}
          </button>
        </nav>
      </aside>

      <main class="docs-content">
        <header class="docs-header">
          <h1>Help & Documentation</h1>
          <p class="subtitle">Master your spatial workspace.</p>
        </header>

        <section id="getting-started" class="content-section">
          <h2>Getting Started</h2>
          <p>Bubbles is a persistent, spatial canvas designed for deep thinking. Unlike traditional chat interfaces, Bubbles allows you to lay out your thoughts, documents, and conversations visually.</p>
          <div class="tip-box">
            <strong>Pro Tip:</strong> Double-click anywhere on the blank canvas to instantly open a new AI chat node.
          </div>
        </section>

        <section id="shortcuts" class="content-section">
          <h2>Keyboard Shortcuts</h2>
          <p>Navigate your workspace at the speed of thought.</p>
          
          <div class="shortcut-list">
            <div class="shortcut-row">
              <span class="action">Pan Canvas</span>
              <kbd>Space + Drag</kbd>
            </div>
            <div class="shortcut-row">
              <span class="action">Zoom In/Out</span>
              <kbd>Cmd/Ctrl + Scroll</kbd>
            </div>
            <div class="shortcut-row">
              <span class="action">New Chat</span>
              <kbd>Double Click</kbd>
            </div>
            <div class="shortcut-row">
              <span class="action">Toggle HUD</span>
              <kbd>Cmd/Ctrl + /</kbd>
            </div>
            <div class="shortcut-row">
              <span class="action">Delete Node</span>
              <kbd>Backspace / Delete</kbd>
            </div>
          </div>
        </section>

        <section id="memory" class="content-section">
          <h2>How Memory Works</h2>
          <p>Bubbles features a persistent, semantic memory system. This means the AI remembers details across different chat nodes and even entirely different workspaces.</p>
          <ul>
            <li><strong>Auto-Extraction:</strong> The AI automatically extracts facts and preferences from your conversations.</li>
            <li><strong>The Memory Hub:</strong> You can view and edit what the AI knows about you by clicking the "Memory" tab in the HUD.</li>
            <li><strong>Privacy:</strong> Your memory is encrypted and never used to train external foundational models.</li>
          </ul>
        </section>
      </main>

    </div>
  </div>
</template>

<style scoped>
.docs-page {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
}

.docs-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 80px 24px;
  display: flex;
  gap: 64px;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
}

/* ── Sidebar ── */
.docs-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  height: max-content;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 48px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding-left: 16px;
}

html.light .sidebar-nav {
  border-color: rgba(0, 0, 0, 0.08);
}

.nav-item {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: var(--text-secondary);
}

.nav-item.active {
  color: var(--text-primary);
  font-weight: 500;
}

/* ── Content ── */
.docs-content {
  flex-grow: 1;
  max-width: 640px;
}

.docs-header {
  margin-bottom: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 32px;
}

html.light .docs-header {
  border-color: rgba(0, 0, 0, 0.08);
}

.docs-header h1 {
  font-size: 32px;
  font-weight: 300;
  letter-spacing: 2px;
  margin: 0 0 12px 0;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.content-section {
  margin-bottom: 64px;
}

.content-section h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 24px 0;
  color: var(--text-primary);
}

.content-section p, 
.content-section li {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
}

.content-section ul {
  padding-left: 24px;
  margin-bottom: 16px;
}

/* ── Specific Elements ── */
.tip-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 20px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 24px;
}

html.light .tip-box {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.08);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.shortcut-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

html.light .shortcut-row {
  border-color: rgba(0, 0, 0, 0.04);
}

.shortcut-row .action {
  font-size: 14px;
  color: var(--text-secondary);
}

kbd {
  font-family: var(--font-mono);
  font-size: 11px;
  background: rgba(255, 255, 255, 0.06);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.light kbd {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .docs-container {
    flex-direction: column;
    gap: 32px;
    padding: 40px 24px;
  }
  
  .docs-sidebar {
    width: 100%;
    position: static;
  }
  
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    border-left: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-left: 0;
    padding-bottom: 16px;
    white-space: nowrap;
  }
}
</style>
