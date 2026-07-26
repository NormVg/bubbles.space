<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
let scrollParent: HTMLElement | Window | null = null

function handleScroll(e: Event) {
  const target = e.target as HTMLElement | Document
  const scrollTop = target === document ? window.scrollY : (target as HTMLElement).scrollTop
  isScrolled.value = scrollTop > 20
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

watch(() => route.path, () => {
  if (isMobileMenuOpen.value) {
    toggleMobileMenu()
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { capture: true })
  
  // Initial check
  const scrollContainer = document.querySelector('.pricing-page') || document.querySelector('.landing-screen')
  if (scrollContainer) {
    isScrolled.value = (scrollContainer as HTMLElement).scrollTop > 20
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, { capture: true })
})
</script>

<template>
  <nav ref="navRef" class="marketing-nav" :class="{ 'is-scrolled': isScrolled }">
    <div class="nav-container">
      <div class="nav-side left">
        <NuxtLink v-if="route.path !== '/'" to="/" class="nav-logo">BUBBLES</NuxtLink>
      </div>
      
      <div class="nav-links desktop-only">
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/manifesto">Manifesto</NuxtLink>
        <NuxtLink to="/use-cases">Use Cases</NuxtLink>
        <NuxtLink to="/investors">Investors</NuxtLink>
        <NuxtLink to="/pricing">Pricing</NuxtLink>
        <NuxtLink to="/docs">Docs</NuxtLink>
      </div>
      
      <div class="nav-links mobile-only-flex">
        <NuxtLink to="/pricing">Pricing</NuxtLink>
      </div>
      
      <div class="nav-side right">
        <button class="hamburger-btn mobile-only" @click="toggleMobileMenu">
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" :class="{ 'is-open': isMobileMenuOpen }">
      <div class="mobile-links">
        <NuxtLink to="/">Home</NuxtLink>
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
  justify-content: space-between;
}

.nav-side {
  flex: 1;
  display: flex;
}

.nav-side.right {
  justify-content: flex-end;
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



.mobile-only {
  display: none;
}
.mobile-only-flex {
  display: none;
}
.mobile-menu-overlay {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  .mobile-only {
    display: block;
  }
  .mobile-only-flex {
    display: flex;
    align-items: center;
  }
  
  .nav-container {
    padding: 0 16px;
  }

  .nav-side.left {
    flex: 1;
    padding-left: 0;
  }
  
  .nav-side.left:empty {
    display: none;
  }

  .nav-side.right {
    display: flex;
    flex: 0 0 auto;
  }

  .hamburger-btn {
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 8px;
    margin-left: 16px;
    margin-right: -8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-menu-overlay {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-base);
    z-index: 99;
    display: flex;
    flex-direction: column;
    padding: 32px 24px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .mobile-menu-overlay.is-open {
    opacity: 1;
    pointer-events: auto;
  }
  
  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .mobile-links a {
    font-size: 24px;
    font-weight: 300;
    color: var(--text-primary);
    text-decoration: none;
  }
  .mobile-links a.router-link-active {
    font-weight: 500;
  }
}
</style>
