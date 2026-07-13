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
    description: 'Stop losing track of context across dozens of browser tabs. Drag PDFs directly onto the canvas, ask Llama 3 to extract key findings, and use Mistral to synthesize the results—all in one visual workspace.',
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
    <MarketingNav />
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
            <!-- Research Visual -->
            <div v-if="activePersona.id === 'research'" class="vis-research">
              <div class="mock-node pdf-n1">
                <div class="mock-line-sm w-half"></div>
                <div class="mock-line-sm w-full"></div>
                <div class="mock-line-sm w-full"></div>
              </div>
              <div class="mock-node pdf-n2">
                <div class="mock-line-sm w-full"></div>
                <div class="mock-line-sm w-half"></div>
              </div>
              <svg class="mock-line" viewBox="0 0 200 200">
                <path d="M 60 40 C 120 40, 100 130, 160 130" class="path-anim" />
                <path d="M 60 160 C 120 160, 100 130, 160 130" class="path-anim delay" />
              </svg>
              <div class="mock-node synth-n3">
                <div class="pulse-orb"></div>
              </div>
            </div>

            <!-- Developers Visual -->
            <div v-else-if="activePersona.id === 'developers'" class="vis-dev">
              <div class="mock-node term-n1">
                <div class="term-header"></div>
                <div class="typewriter">
                  <div class="code-line c1"></div>
                  <div class="code-line c2"></div>
                  <div class="code-line c3"></div>
                </div>
              </div>
              <svg class="mock-line" viewBox="0 0 200 200">
                <path d="M 90 100 L 140 100" class="path-anim-fast" />
                <path d="M 140 100 L 140 50 L 160 50" class="path-anim-fast delay" />
                <path d="M 140 100 L 140 150 L 160 150" class="path-anim-fast delay" />
              </svg>
              <div class="mock-node diag-n2"></div>
              <div class="mock-node diag-n3"></div>
            </div>

            <!-- Writers Visual -->
            <div v-else-if="activePersona.id === 'writers'" class="vis-write">
              <div class="mock-node outline-n1">
                <div class="bullet-list">
                  <div class="bullet"></div><div class="b-text"></div>
                  <div class="bullet"></div><div class="b-text"></div>
                </div>
              </div>
              <svg class="mock-line" viewBox="0 0 200 200">
                <path d="M 70 70 C 100 70, 100 120, 130 120" class="path-anim" />
              </svg>
              <div class="mock-node draft-n2">
                <div class="mock-title"></div>
                <div class="mock-line-sm w-full"></div>
                <div class="mock-line-sm w-full"></div>
                <div class="mock-line-sm w-half typing-cursor"></div>
              </div>
            </div>

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

/* ── Shared Mock Elements ── */
.mock-node {
  position: absolute;
  background: var(--bg-base);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
  transition: all 0.3s ease;
}

html.light .mock-node {
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.mock-line-sm {
  height: 2px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
}
html.light .mock-line-sm { background: rgba(0,0,0,0.2); }
.w-full { width: 100%; }
.w-half { width: 50%; }

.mock-line {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.mock-line path {
  fill: none;
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 1.5;
  stroke-linecap: round;
}
html.light .mock-line path { stroke: rgba(0, 0, 0, 0.15); }

.path-anim {
  stroke-dasharray: 4 8;
  animation: flow-line 2s linear infinite;
}
.path-anim-fast {
  stroke-dasharray: 4 8;
  animation: flow-line 1s linear infinite;
}
.delay { animation-delay: 1s; }

@keyframes flow-line {
  to { stroke-dashoffset: -24; }
}

/* ── Vis 1: Research ── */
.pdf-n1 { width: 50px; height: 60px; top: 10px; left: 10px; animation: float 4s ease-in-out infinite; }
.pdf-n2 { width: 50px; height: 60px; top: 130px; left: 10px; animation: float 5s ease-in-out infinite reverse; }
.synth-n3 { width: 40px; height: 40px; top: 110px; left: 140px; border-radius: 50%; padding: 0; align-items: center; justify-content: center; border-color: var(--accent); }
.pulse-orb { width: 12px; height: 12px; background: var(--accent); border-radius: 50%; animation: pulse-glow 2s infinite alternate; }

/* ── Vis 2: Developers ── */
.term-n1 { width: 80px; height: 70px; top: 65px; left: 10px; background: rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.2); padding: 0; overflow: hidden;}
html.light .term-n1 { background: rgba(0,0,0,0.8); }
.term-header { height: 12px; background: rgba(255,255,255,0.1); width: 100%; border-bottom: 1px solid rgba(255,255,255,0.1); }
.typewriter { padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.code-line { height: 2px; background: var(--success); border-radius: 2px; }
.c1 { width: 80%; animation: type 3s steps(10) infinite; }
.c2 { width: 60%; animation: type 3s steps(10) infinite 1s; opacity: 0; animation-fill-mode: forwards; }
.c3 { width: 90%; background: var(--danger); animation: type 3s steps(10) infinite 2s; opacity: 0; animation-fill-mode: forwards; }

.diag-n2 { width: 40px; height: 30px; top: 35px; left: 150px; background: var(--bg-muted); }
.diag-n3 { width: 40px; height: 30px; top: 135px; left: 150px; background: var(--bg-muted); }

/* ── Vis 3: Writers ── */
.outline-n1 { width: 60px; height: 70px; top: 35px; left: 10px; }
.bullet-list { display: grid; grid-template-columns: 8px 1fr; gap: 4px; align-items: center; margin-top: 4px; }
.bullet { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }
.b-text { height: 2px; background: rgba(255,255,255,0.2); width: 100%; }
html.light .b-text { background: rgba(0,0,0,0.2); }

.draft-n2 { width: 70px; height: 90px; top: 75px; left: 120px; }
.mock-title { width: 60%; height: 4px; background: var(--text-primary); margin-bottom: 4px; border-radius: 2px; }
.typing-cursor { position: relative; }
.typing-cursor::after { content: ''; position: absolute; right: -6px; top: -2px; width: 2px; height: 6px; background: var(--text-primary); animation: blink 1s step-end infinite; }

@keyframes float { 50% { transform: translateY(-4px); } }
@keyframes pulse-glow { 100% { box-shadow: 0 0 16px var(--accent); transform: scale(1.1); } }
@keyframes type { 0% { width: 0; opacity: 1; } 50%, 100% { opacity: 1; } }
@keyframes blink { 50% { opacity: 0; } }

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
