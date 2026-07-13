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
        <p>Llama 3, Mistral, and other leading open-source models working side-by-side.</p>
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
  border: 1px solid inherit;
  animation: expand-fade 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.delay-1 { animation-delay: 0.6s; }
.delay-2 { animation-delay: 1.2s; }

.sync-beam {
  position: absolute;
  top: 50%; left: 50%;
  width: 60px; height: 60px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: core-pulse 2s ease-in-out infinite alternate;
}

/* ─── Keyframes ─── */
@keyframes float-1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes float-2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes float-3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes pulse-line { 0% { opacity: 0.2; } 100% { opacity: 0.8; } }
@keyframes core-pulse { 0% { transform: scale(0.9); opacity: 0.8; } 100% { transform: scale(1.1); opacity: 1; } }
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes expand-fade { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }
@keyframes orbit-1 { 
  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); } 
  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); } 
}
@keyframes orbit-2 { 
  0% { transform: rotate(120deg) translateX(50px) rotate(-120deg); } 
  100% { transform: rotate(480deg) translateX(50px) rotate(-480deg); } 
}
@keyframes orbit-3 { 
  0% { transform: rotate(240deg) translateX(30px) rotate(-240deg); } 
  100% { transform: rotate(600deg) translateX(30px) rotate(-600deg); } 
}

@media (max-width: 768px) {
  .landing-features {
    grid-template-columns: 1fr;
  }
}
</style>
