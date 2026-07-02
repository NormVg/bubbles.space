<script setup lang="ts">
defineProps<{
  isReady: boolean
}>()
</script>

<template>
  <div class="splash-screen" :class="{ leaving: isReady }">
    <div class="splash-content">
      <div class="logo-wrapper">
        <h1 class="logo-text">BUBBLES</h1>
      </div>
      <div class="loader-track">
        <div class="loader-fill"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash-screen {
  position: absolute;
  inset: 0;
  z-index: 9999;
  background-color: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity, filter;
  pointer-events: all;
}

/* When the app is ready, the splash screen scales towards the user and fades out */
.splash-screen.leaving {
  pointer-events: none;
  animation: splash-fade-out 0.8s cubic-bezier(0.7, 0, 0.3, 1) forwards;
}

@keyframes splash-fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: scale(1.08); /* Scales up into the camera */
    filter: blur(4px);
  }
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.logo-wrapper {
  overflow: hidden;
}

.logo-text {
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 12px;
  margin-right: -12px; /* compensate for tracking on last letter */
  color: var(--text-primary);
  opacity: 0;
  transform: translateY(10px);
  animation: logo-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.2s;
}

html.light .logo-text {
  font-weight: 400;
}

@keyframes logo-reveal {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader-track {
  width: 120px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: fade-in 0.4s ease forwards;
  animation-delay: 0.6s;
}

html.light .loader-track {
  background: rgba(0, 0, 0, 0.1);
}

.loader-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--text-primary);
  width: 0%;
  /* 
    The loader simulates loading progress. 
    It quickly jumps to 30%, waits, then zips to 100% 
  */
  animation: load-progress 1.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
  animation-delay: 0.6s;
}

@keyframes fade-in {
  to { opacity: 1; }
}

@keyframes load-progress {
  0% {
    width: 0%;
  }
  40% {
    width: 35%;
  }
  70% {
    width: 75%;
  }
  100% {
    width: 100%;
  }
}
</style>
