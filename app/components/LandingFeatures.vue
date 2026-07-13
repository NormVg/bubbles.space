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
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 1)" @mouseleave="handleMouseLeave" :class="{ 'is-active': activeCard === 1 }">
      <div class="node-visualization spatial-vis" :style="{ transform: activeCard === 1 ? `translate(${mouseX * -15}px, ${mouseY * -15}px)` : 'translate(0, 0)' }">
        <div class="spatial-grid"></div>
        <div class="spatial-wrapper">
          <svg class="spatial-lines" viewBox="0 0 400 400">
            <path d="M 120 180 C 180 180, 200 240, 220 240" class="flow-line" />
            <path d="M 140 300 C 180 300, 200 240, 220 240" class="flow-line delay-1" />
            <path d="M 220 240 C 280 240, 300 160, 320 160" class="flow-line delay-2" />
          </svg>
          
          <div class="sp-node n-text">
            <div class="mock-line-sm w-half"></div>
            <div class="mock-line-sm w-full"></div>
            <div class="mock-line-sm w-full"></div>
          </div>
          <div class="sp-node n-image">
            <div class="mock-img"></div>
            <div class="mock-line-sm w-full"></div>
          </div>
          <div class="sp-node n-core">
            <div class="core-pulse"></div>
          </div>
          <div class="sp-node n-code">
            <div class="code-dot"></div>
            <div class="code-dot c-green"></div>
            <div class="mock-line-sm code-l"></div>
            <div class="mock-line-sm code-l indented"></div>
          </div>
        </div>
      </div>
      <div class="node-content">
        <h3>Spatial Canvas</h3>
        <p>Spread your thoughts out spatially. No more scrolling up to find context.</p>
      </div>
    </div>

    <!-- Semantic Memory Feature -->
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 2)" @mouseleave="handleMouseLeave" :class="{ 'is-active': activeCard === 2 }">
      <div class="node-visualization memory-vis">
        <div class="memory-wrapper">
          <div class="mem-core">
            <div class="mem-ring r1"></div>
            <div class="mem-ring r2"></div>
            <div class="mem-center"></div>
          </div>
          
          <svg class="mem-lines" viewBox="0 0 200 200">
            <path d="M 100 160 C 100 120, 100 80, 100 60" class="mem-flow" />
          </svg>
          
          <div class="mem-particles">
             <div class="m-particle p1"></div>
             <div class="m-particle p2"></div>
             <div class="m-particle p3"></div>
          </div>

          <div class="mem-input">
            <div class="mock-line-sm mem-type typing-fx"></div>
          </div>
        </div>
      </div>
      <div class="node-content">
        <h3>Semantic Memory</h3>
        <p>The AI remembers you across sessions. Build a brain, not just a chat.</p>
      </div>
    </div>

    <!-- Multi-Model Feature -->
    <div class="feature-node" @mousemove="e => handleMouseMove(e, 3)" @mouseleave="handleMouseLeave" :class="{ 'is-active': activeCard === 3 }">
      <div class="node-visualization model-vis">
        <div class="model-wrapper">
          <div class="mod-prompt">
            <div class="mod-dot"></div>
            <div class="mock-line-sm w-full"></div>
          </div>
          
          <svg class="mod-lines" viewBox="0 0 200 200">
            <path d="M 60 100 C 90 100, 100 25, 130 25" class="mod-flow" />
            <path d="M 60 100 C 90 100, 100 75, 130 75" class="mod-flow" />
            <path d="M 60 100 C 90 100, 100 125, 130 125" class="mod-flow" />
            <path d="M 60 100 C 90 100, 100 175, 130 175" class="mod-flow" />
          </svg>

          <div class="mod-nodes">
            <div class="m-node qwen">
              <span class="m-label">Qwen</span>
              <div class="m-out"><div class="mock-line-sm"></div></div>
            </div>
            <div class="m-node glm">
              <span class="m-label">GLM</span>
              <div class="m-out"><div class="mock-line-sm w-half"></div></div>
            </div>
            <div class="m-node minimax">
              <span class="m-label">MiniMax</span>
              <div class="m-out"><div class="mock-line-sm"></div></div>
            </div>
            <div class="m-node gemma">
              <span class="m-label">Gemma</span>
              <div class="m-out"><div class="mock-line-sm w-half"></div></div>
            </div>
          </div>
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

/* ─── 1. Custom Spatial Canvas ─── */
.spatial-vis { perspective: 800px; }
.spatial-grid {
  position: absolute;
  inset: -100%;
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 40px 40px;
  transform: rotateX(60deg) translateY(-100px) translateZ(-200px);
  opacity: 0.5;
}
html.light .spatial-grid { background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0); }
.spatial-wrapper {
  width: 400px; height: 400px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.sp-node {
  position: absolute;
  background: var(--bg-base);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.4s ease;
}
html.light .sp-node { border-color: rgba(0, 0, 0, 0.1); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); }

.n-text { width: 80px; top: 130px; left: 80px; transform: translateZ(20px); }
.n-image { width: 100px; top: 250px; left: 100px; transform: translateZ(40px); }
.n-core { width: 32px; height: 32px; top: 220px; left: 220px; border-radius: 50%; padding: 0; align-items: center; justify-content: center; border-color: var(--accent); transform: translateZ(60px); }
.n-code { width: 90px; top: 120px; left: 260px; transform: translateZ(30px); }

.mock-img { width: 100%; height: 40px; background: rgba(255,255,255,0.05); border-radius: 4px; }
.code-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); position: absolute; top: 8px; }
.code-dot.c-green { left: 20px; background: var(--success); }
.code-l { margin-top: 14px; }
.indented { margin-left: 8px; width: 60%; }

.core-pulse { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 12px var(--accent); animation: pulse 2s infinite alternate; }

.spatial-lines { position: absolute; inset: 0; width: 100%; height: 100%; transform: translateZ(10px); }
.flow-line { fill: none; stroke: rgba(255, 255, 255, 0.2); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 6 12; animation: flow 2s linear infinite; }
html.light .flow-line { stroke: rgba(0,0,0,0.2); }
.delay-1 { animation-delay: 0.5s; }
.delay-2 { animation-delay: 1s; }

.is-active .n-text { transform: translateZ(40px) scale(1.05); border-color: rgba(255,255,255,0.3); }
.is-active .n-image { transform: translateZ(60px) scale(1.05); border-color: rgba(255,255,255,0.3); }
.is-active .n-code { transform: translateZ(50px) scale(1.05); border-color: rgba(255,255,255,0.3); }
.is-active .flow-line { stroke: var(--accent); animation: flow 1s linear infinite; }

/* ─── 2. Custom Semantic Memory ─── */
.memory-wrapper { width: 200px; height: 200px; position: relative; }
.mem-core {
  position: absolute; top: 40px; left: 80px;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
}
.mem-center { width: 16px; height: 16px; background: var(--text-primary); border-radius: 50%; box-shadow: 0 0 20px var(--text-primary); transition: all 0.3s ease; }
.mem-ring {
  position: absolute; border-radius: 50%;
  border: 1px dashed rgba(255,255,255,0.3);
  animation: spin 10s linear infinite;
}
html.light .mem-ring { border-color: rgba(0,0,0,0.3); }
.r1 { width: 50px; height: 50px; }
.r2 { width: 80px; height: 80px; animation-direction: reverse; animation-duration: 15s; }

.mem-input {
  position: absolute; bottom: 30px; left: 40px;
  width: 120px; height: 32px;
  background: var(--bg-base); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
  display: flex; align-items: center; padding: 0 12px;
}
html.light .mem-input { border-color: rgba(0,0,0,0.1); }
.mem-type { width: 0; background: var(--text-primary); height: 4px; border-radius: 2px; }

.mem-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
.mem-flow { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 2; stroke-dasharray: 4 4; }
html.light .mem-flow { stroke: rgba(0,0,0,0.1); }

.mem-particles { position: absolute; inset: 0; }
.m-particle { position: absolute; width: 4px; height: 4px; background: var(--accent); border-radius: 50%; opacity: 0; }
.p1 { bottom: 60px; left: 100px; }
.p2 { bottom: 80px; left: 90px; }
.p3 { bottom: 100px; left: 110px; }

.is-active .mem-type { animation: typing 2s steps(20) infinite; }
.is-active .mem-center { transform: scale(1.3); box-shadow: 0 0 30px var(--accent); background: var(--accent); }
.is-active .mem-ring { border-color: var(--accent); animation-duration: 4s; }
.is-active .mem-flow { stroke: var(--accent); animation: flow 1s linear infinite; }
.is-active .p1 { animation: float-up 1.5s ease-in infinite; }
.is-active .p2 { animation: float-up 1.5s ease-in infinite 0.5s; }
.is-active .p3 { animation: float-up 1.5s ease-in infinite 1s; }

/* ─── 3. Custom Multi-Model ─── */
.model-wrapper { width: 200px; height: 200px; position: relative; }
.mod-prompt {
  position: absolute; top: 85px; left: 20px;
  width: 50px; height: 30px;
  background: var(--bg-base); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
  display: flex; align-items: center; padding: 0 8px; gap: 6px;
}
html.light .mod-prompt { border-color: rgba(0,0,0,0.1); }
.mod-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-primary); }

.mod-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
.mod-flow { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 2; stroke-linecap: round; }
html.light .mod-flow { stroke: rgba(0,0,0,0.1); }

.mod-nodes { position: absolute; inset: 0; }
.m-node {
  position: absolute; left: 130px;
  display: flex; align-items: center; gap: 8px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.m-label { font-size: 10px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; opacity: 0; transform: translateX(-10px); transition: all 0.3s ease; }
.m-out { width: 40px; height: 24px; background: var(--bg-base); border: 1px solid; border-radius: 4px; display: flex; align-items: center; padding: 0 6px; }

.qwen { top: 13px; }
.qwen .m-out { border-color: #3B82F6; }
.glm { top: 63px; }
.glm .m-out { border-color: #F59E0B; }
.minimax { top: 113px; }
.minimax .m-out { border-color: #10B981; }
.gemma { top: 163px; }
.gemma .m-out { border-color: #8B5CF6; }

.is-active .mod-flow { stroke-dasharray: 6 12; animation: flow 1s linear infinite; }
.is-active .m-label { opacity: 1; transform: translateX(0); }
.is-active .qwen { transform: scale(1.1) translateX(5px); }
.is-active .glm { transform: scale(1.1) translateX(5px); transition-delay: 0.1s; }
.is-active .minimax { transform: scale(1.1) translateX(5px); transition-delay: 0.2s; }
.is-active .gemma { transform: scale(1.1) translateX(5px); transition-delay: 0.3s; }
.is-active .m-out .mock-line-sm { animation: type 1s steps(5) infinite; }

/* ─── Global Keyframes ─── */
@keyframes flow { to { stroke-dashoffset: -24; } }
@keyframes pulse { 100% { transform: scale(1.3); opacity: 0.8; } }
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes typing { 0% { width: 0; } 50%, 100% { width: 80%; } }
@keyframes type { 0% { width: 0; opacity: 1; } 50%, 100% { opacity: 1; } }
@keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-40px) scale(0.5); opacity: 0; } }

.mock-line-sm { height: 2px; background: rgba(255,255,255,0.2); border-radius: 2px; }
html.light .mock-line-sm { background: rgba(0,0,0,0.2); }
.w-full { width: 100%; }
.w-half { width: 50%; }
</style>
