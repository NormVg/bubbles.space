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
      <div class="node-visualization">
        <div class="mini-canvas" :style="{ transform: activeCard === 1 ? `translate(${mouseX * -10}px, ${mouseY * -10}px)` : 'translate(0, 0)' }">
          <div class="grid-bg"></div>
          <div class="mini-node node-1"></div>
          <div class="mini-node node-2"></div>
          <div class="mini-node node-3"></div>
          <div class="connection-line"></div>
        </div>
      </div>
      <div class="node-content">
        <h3>Spatial Canvas</h3>
        <p>Spread your thoughts out spatially. No more scrolling up to find context.</p>
      </div>
    </div>

    <!-- Semantic Memory Feature -->
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 2)" @mouseleave="handleMouseLeave">
      <div class="node-visualization">
        <div class="memory-core" :style="{ transform: activeCard === 2 ? `translate(${mouseX * 10}px, ${mouseY * 10}px)` : 'translate(0, 0)' }">
          <div class="core-orb"></div>
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="particle p-1"></div>
          <div class="particle p-2"></div>
          <div class="particle p-3"></div>
        </div>
      </div>
      <div class="node-content">
        <h3>Semantic Memory</h3>
        <p>The AI remembers you across sessions. Build a brain, not just a chat.</p>
      </div>
    </div>

    <!-- Multi-Model Feature -->
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 3)" @mouseleave="handleMouseLeave">
      <div class="node-visualization">
        <div class="model-cluster" :style="{ transform: activeCard === 3 ? `translate(${mouseX * -10}px, ${mouseY * 10}px)` : 'translate(0, 0)' }">
          <div class="model-orb llama">
            <div class="pulse-ring"></div>
          </div>
          <div class="model-orb mistral">
            <div class="pulse-ring delay-1"></div>
          </div>
          <div class="model-orb claude">
            <div class="pulse-ring delay-2"></div>
          </div>
          <div class="sync-beam"></div>
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
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
  perspective: 1000px;
}

/* Base Node Styling */
.feature-node {
  position: relative;
  width: 100%;
  height: 380px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.0) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

html.light .feature-node {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.0) 100%);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.02);
}

.node-visualization {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding-bottom: 40px; /* Shift visual up slightly to make room for text */
}

.node-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 60px 32px 32px;
  background: linear-gradient(to top, rgba(24, 23, 28, 0.95) 0%, rgba(24, 23, 28, 0) 100%);
  z-index: 2;
}

html.light .node-content {
  background: linear-gradient(to top, rgba(228, 228, 231, 0.95) 0%, rgba(228, 228, 231, 0) 100%);
}

.node-content h3 {
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.node-content p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* ─── 1. Spatial Canvas Vis ─── */
.mini-canvas {
  width: 150%;
  height: 150%;
  position: relative;
  transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1); /* Parallax ease */
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--dot-color) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center;
  opacity: 0.5;
  animation: pan-grid 20s linear infinite;
}

@keyframes pan-grid {
  from { background-position: 0 0; }
  to { background-position: -40px -40px; }
}

.mini-node {
  position: absolute;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.node-1 { width: 60px; height: 40px; top: 40%; left: 30%; animation: float-1 4s ease-in-out infinite; }
.node-2 { width: 80px; height: 50px; top: 20%; left: 55%; animation: float-2 5s ease-in-out infinite reverse; }
.node-3 { width: 40px; height: 40px; top: 60%; left: 65%; animation: float-3 4.5s ease-in-out infinite; }

.connection-line {
  position: absolute;
  top: 45%; left: 35%;
  width: 80px; height: 2px;
  background: linear-gradient(90deg, var(--text-muted), transparent);
  transform: rotate(-15deg);
  opacity: 0.5;
  animation: pulse-line 2s ease-in-out infinite alternate;
}

/* ─── 2. Semantic Memory Vis ─── */
.memory-core {
  position: relative;
  width: 100px; height: 100px;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1);
}

.core-orb {
  width: 24px; height: 24px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--accent);
  animation: core-pulse 2s ease-in-out infinite alternate;
  z-index: 2;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--accent);
  opacity: 0.2;
}

.ring-1 { width: 60px; height: 60px; animation: spin 10s linear infinite; border-style: dashed; }
.ring-2 { width: 100px; height: 100px; animation: spin 15s linear infinite reverse; }

.particle {
  position: absolute;
  width: 4px; height: 4px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
}

.p-1 { animation: orbit-1 4s linear infinite; }
.p-2 { animation: orbit-2 5s linear infinite; }
.p-3 { animation: orbit-3 3.5s linear infinite; }

/* ─── 3. Multi-Model Vis ─── */
.model-cluster {
  position: relative;
  width: 120px; height: 120px;
  transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1);
}

.model-orb {
  position: absolute;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 2px solid var(--text-secondary);
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
}

.model-orb.llama { top: 20px; left: 50%; transform: translateX(-50%); border-color: #3b82f6; }
.model-orb.mistral { bottom: 20px; left: 20px; border-color: #f59e0b; }
.model-orb.claude { bottom: 20px; right: 20px; border-color: #10b981; }

.pulse-ring {
  position: absolute;
  width: 100%; height: 100%;
  border-radius: 50%;
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
