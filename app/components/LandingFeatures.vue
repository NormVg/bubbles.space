<script setup lang="ts">
import { ref } from 'vue'

const activeCard = ref<number | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

function handleMouseMove(e: MouseEvent, cardIndex: number) {
  activeCard.value = cardIndex
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 2 - 1
}

function handleMouseLeave() {
  activeCard.value = null
  mouseX.value = 0
  mouseY.value = 0
}
</script>

<template>
  <section class="landing-features">
    
    <!-- Spatial Canvas Feature -->
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 1)" @mouseleave="handleMouseLeave">
      <div class="node-visualization" :style="{ transform: activeCard === 1 ? `translate(${mouseX * -10}px, ${mouseY * -10}px)` : 'translate(0, 0)' }">
        <div class="mock-canvas scale-up">
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
      </div>
      <div class="node-content">
        <h3>Spatial Canvas</h3>
        <p>Spread your thoughts out spatially. No more scrolling up to find context.</p>
      </div>
    </div>

    <!-- Semantic Memory Feature -->
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 2)" @mouseleave="handleMouseLeave">
      <div class="node-visualization" :style="{ transform: activeCard === 2 ? `translate(${mouseX * 10}px, ${mouseY * 10}px)` : 'translate(0, 0)' }">
        <div class="mock-canvas">
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
      <div class="node-content">
        <h3>Semantic Memory</h3>
        <p>The AI remembers you across sessions. Build a brain, not just a chat.</p>
      </div>
    </div>

    <!-- Multi-Model Feature -->
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 3)" @mouseleave="handleMouseLeave">
      <div class="node-visualization" :style="{ transform: activeCard === 3 ? `translate(${mouseX * -10}px, ${mouseY * 10}px)` : 'translate(0, 0)' }">
        <div class="mock-canvas">
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
      </div>
      <div class="node-content">
        <h3>Multi-Model</h3>
        <p>Qwen, GLM, MiniMax, Gemma and other leading models working side-by-side.</p>
      </div>
    </div>

  </section>
</template>

<style scoped>
.landing-features {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 280px);
  gap: 0;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0;
  perspective: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

html.light .landing-features {
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.03);
}

/* Base Node Styling */
.feature-node {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0; /* Sharp corners inside the gapless grid */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

html.light .feature-node {
  background: rgba(0, 0, 0, 0.01);
}

/* Bento Placements & Internal Borders */
.feature-node:nth-child(1) {
  grid-column: span 8;
  grid-row: span 2;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}
html.light .feature-node:nth-child(1) { border-right-color: rgba(0,0,0,0.08); }

.feature-node:nth-child(2) {
  grid-column: span 4;
  grid-row: span 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
html.light .feature-node:nth-child(2) { border-bottom-color: rgba(0,0,0,0.08); }

.feature-node:nth-child(3) {
  grid-column: span 4;
  grid-row: span 1;
}

.node-visualization {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding-bottom: 40px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.node-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 60px 32px 32px;
  background: linear-gradient(to top, rgba(24, 23, 28, 0.95) 0%, rgba(24, 23, 28, 0) 100%);
  z-index: 2;
  text-align: left;
}

html.light .node-content {
  background: linear-gradient(to top, rgba(228, 228, 231, 0.95) 0%, rgba(228, 228, 231, 0) 100%);
}

.node-content h3 {
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
}

.node-content p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 900px) {
  .landing-features {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .feature-node:nth-child(1),
  .feature-node:nth-child(2),
  .feature-node:nth-child(3) {
    grid-column: span 1;
    grid-row: span 1;
    height: 380px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  html.light .feature-node:nth-child(1),
  html.light .feature-node:nth-child(2),
  html.light .feature-node:nth-child(3) {
    border-bottom-color: rgba(0,0,0,0.08);
  }
  .feature-node:nth-child(3) { border-bottom: none; }
}

/* ─── Mock Canvas Assets ─── */
.mock-canvas {
  width: 200px;
  height: 200px;
  position: relative;
}
.scale-up {
  transform: scale(1.3);
}

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

.mock-line-sm { height: 2px; background: rgba(255,255,255,0.2); border-radius: 2px; }
html.light .mock-line-sm { background: rgba(0,0,0,0.2); }
.w-full { width: 100%; }
.w-half { width: 50%; }

.mock-line { position: absolute; inset: 0; width: 100%; height: 100%; }
.mock-line path { fill: none; stroke: rgba(255, 255, 255, 0.15); stroke-width: 1.5; stroke-linecap: round; }
html.light .mock-line path { stroke: rgba(0, 0, 0, 0.15); }
.path-anim { stroke-dasharray: 4 8; animation: flow-line 2s linear infinite; }
.path-anim-fast { stroke-dasharray: 4 8; animation: flow-line 1s linear infinite; }
.delay { animation-delay: 1s; }

@keyframes flow-line { to { stroke-dashoffset: -24; } }
@keyframes float { 50% { transform: translateY(-4px); } }
@keyframes pulse-glow { 100% { box-shadow: 0 0 16px var(--accent); transform: scale(1.1); } }
@keyframes blink { 50% { opacity: 0; } }
@keyframes type { 0% { width: 0; opacity: 1; } 50%, 100% { opacity: 1; } }

/* Spatial Canvas */
.pdf-n1 { width: 50px; height: 60px; top: 10px; left: 10px; animation: float 4s ease-in-out infinite; }
.pdf-n2 { width: 50px; height: 60px; top: 130px; left: 10px; animation: float 5s ease-in-out infinite reverse; }
.synth-n3 { width: 40px; height: 40px; top: 110px; left: 140px; border-radius: 50%; padding: 0; align-items: center; justify-content: center; border-color: var(--accent); }
.pulse-orb { width: 12px; height: 12px; background: var(--accent); border-radius: 50%; animation: pulse-glow 2s infinite alternate; }

/* Semantic Memory */
.outline-n1 { width: 60px; height: 70px; top: 35px; left: 10px; }
.bullet-list { display: grid; grid-template-columns: 8px 1fr; gap: 4px; align-items: center; margin-top: 4px; }
.bullet { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }
.b-text { height: 2px; background: rgba(255,255,255,0.2); width: 100%; }
html.light .b-text { background: rgba(0,0,0,0.2); }
.draft-n2 { width: 70px; height: 90px; top: 75px; left: 120px; }
.mock-title { width: 60%; height: 4px; background: var(--text-primary); margin-bottom: 4px; border-radius: 2px; }
.typing-cursor { position: relative; }
.typing-cursor::after { content: ''; position: absolute; right: -6px; top: -2px; width: 2px; height: 6px; background: var(--text-primary); animation: blink 1s step-end infinite; }

/* Multi-Model */
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
</style>
