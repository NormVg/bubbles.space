<script setup lang="ts">
import { ref } from 'vue'

useSeoMeta({
  title: 'Use Cases - Bubbles',
  description: 'See how researchers, developers, and writers use Bubbles.space to organize their thoughts.',
})

const personas = [
  {
    id: 'research',
    title: 'For Researchers',
    headline: 'Map out complex papers and ideas.',
    description: 'Stop losing track of context across dozens of browser tabs. Drag PDFs directly onto the canvas, ask Claude to extract key findings, and use GPT-4o to synthesize the results—all in one visual workspace.',
    features: ['PDF parsing', 'Multi-model synthesis', 'Spatial organization']
  },
  {
    id: 'development',
    title: 'For Developers',
    headline: 'Architect systems visually.',
    description: 'Plan your database schemas and system architecture on the canvas. Have the AI generate the boilerplate code right next to your diagrams, keeping the high-level architecture and the implementation details in perfect sync.',
    features: ['Mermaid diagrams', 'Code generation', 'Persistent context']
  },
  {
    id: 'writing',
    title: 'For Writers',
    headline: 'World-building without limits.',
    description: 'Keep your character sheets, plot outlines, and draft chapters arranged visually. Because Bubbles has persistent memory, the AI remembers your lore and character voices across every session.',
    features: ['Semantic memory', 'Brainstorming nodes', 'Non-linear drafting']
  }
]

const activePersona = ref(personas[0])
</script>

<template>
  <div class="usecases-page">
    <div class="usecases-container">
      <NuxtLink to="/" class="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </NuxtLink>
      
      <header class="usecases-header">
        <h1>How people use Bubbles.</h1>
      </header>

      <div class="usecases-tabs">
        <button 
          v-for="persona in personas" 
          :key="persona.id"
          @click="activePersona = persona"
          class="tab-btn"
          :class="{ active: activePersona.id === persona.id }"
        >
          {{ persona.title }}
        </button>
      </div>

      <div class="active-content" :key="activePersona.id">
        <div class="content-text">
          <h2>{{ activePersona.headline }}</h2>
          <p>{{ activePersona.description }}</p>
          
          <ul class="feature-list">
            <li v-for="feature in activePersona.features" :key="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
              {{ feature }}
            </li>
          </ul>

          <NuxtLink to="/pricing" class="cta-link">Start your workspace →</NuxtLink>
        </div>
        
        <div class="content-visual">
          <div class="mock-canvas">
            <!-- Decorative abstract nodes to represent the canvas -->
            <div class="mock-node n1"></div>
            <div class="mock-node n2"></div>
            <div class="mock-node n3"></div>
            <svg class="mock-line" viewBox="0 0 200 200">
              <path d="M 50 50 C 100 50, 100 150, 150 150" fill="none" stroke="currentColor" stroke-dasharray="4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usecases-page {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 80px 24px 120px;
}

.usecases-container {
  max-width: 1024px;
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

.usecases-header {
  margin-bottom: 48px;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.usecases-header h1 {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin: 0;
}

/* ── Tabs ── */
.usecases-tabs {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 64px;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) 100ms both;
}

html.light .usecases-tabs {
  border-color: rgba(0, 0, 0, 0.08);
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  padding: 0 0 16px 0;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.tab-btn:hover {
  color: var(--text-secondary);
}

.tab-btn.active {
  color: var(--text-primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--text-primary);
}

/* ── Content Area ── */
.active-content {
  display: flex;
  gap: 80px;
  align-items: center;
  animation: fade-in-up 0.6s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.content-text {
  flex: 1;
}

.content-text h2 {
  font-size: 32px;
  font-weight: 300;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.content-text p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 48px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.feature-list svg {
  color: var(--text-primary);
}

.cta-link {
  display: inline-flex;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--text-primary);
  padding-bottom: 4px;
  transition: opacity 0.2s ease;
}

.cta-link:hover {
  opacity: 0.7;
}

/* ── Visual (Abstract Canvas) ── */
.content-visual {
  flex: 1;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

html.light .content-visual {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.mock-canvas {
  width: 200px;
  height: 200px;
  position: relative;
}

.mock-node {
  position: absolute;
  background: var(--bg-base);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

html.light .mock-node {
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.n1 { width: 60px; height: 80px; top: 10px; left: 20px; }
.n2 { width: 80px; height: 40px; top: 130px; left: 130px; }
.n3 { width: 40px; height: 40px; top: 60px; left: 150px; border-radius: 50%; }

.mock-line {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.15);
}

html.light .mock-line {
  color: rgba(0, 0, 0, 0.15);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .active-content {
    flex-direction: column;
    gap: 48px;
  }
  
  .content-visual {
    width: 100%;
    aspect-ratio: 16/9;
  }
}
</style>
