<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const navRef = ref<HTMLElement | null>(null)
let scrollParent: HTMLElement | Window | null = null

function handleScroll(e: Event) {
  const target = e.target as HTMLElement | Document
  const scrollTop = target === document ? window.scrollY : (target as HTMLElement).scrollTop
  isScrolled.value = scrollTop > 20
}

onMounted(() => {
  // Find the closest scrollable container (usually the page wrapper)
  if (navRef.value) {
    scrollParent = navRef.value.parentElement
    if (scrollParent) {
      scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    }
  }
})

onUnmounted(() => {
  if (scrollParent) {
    scrollParent.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <nav ref="navRef" class="marketing-nav" :class="{ 'is-scrolled': isScrolled }">
    <div class="nav-container">
      <div class="nav-links">
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/manifesto">Manifesto</NuxtLink>
        <NuxtLink to="/use-cases">Use Cases</NuxtLink>
        <NuxtLink to="/investors">Investors</NuxtLink>
        <NuxtLink to="/pricing">Pricing</NuxtLink>
        <NuxtLink to="/docs">Docs</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.marketing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 100;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.marketing-nav.is-scrolled {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

html.light .marketing-nav.is-scrolled {
  background: rgba(255, 255, 255, 0.8);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-logo {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 4px;
  color: var(--text-primary);
  text-decoration: none;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links a {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--text-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
}

.nav-cta {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--text-primary);
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

html.light .nav-cta {
  border-color: rgba(0, 0, 0, 0.2);
}

.nav-cta:hover {
  background: var(--text-primary);
  color: var(--bg-base);
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* Hide standard links on mobile */
  }
}
</style>
