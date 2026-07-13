<script setup lang="ts">
import { ref } from 'vue'

const isYearly = ref(false)

const tiers = [
  {
    name: 'BASE',
    priceMonthly: 9,
    priceYearly: 7,
    description: 'The entry point for individual thinkers.',
    features: [
      '1 Active Workspace',
      '500 AI Requests / month',
      'Standard Context (32k)',
      'Basic Persistent Memory',
      'Standard Canvas Widgets'
    ],
    buttonText: 'GET STARTED',
    highlight: false
  },
  {
    name: 'PRO',
    priceMonthly: 29,
    priceYearly: 24,
    description: 'For power users replacing multiple AI subscriptions.',
    features: [
      'Unlimited Workspaces',
      'Unlimited Standard Requests',
      '500 Premium Requests / month',
      'Extended Context (128k)',
      'Deep Memory & Web Search'
    ],
    buttonText: 'UPGRADE TO PRO',
    highlight: true // The recommended tier
  },
  {
    name: 'MAX',
    priceMonthly: 79,
    priceYearly: 69,
    description: 'For heavy researchers and extreme power users.',
    features: [
      'Everything in Pro',
      '2,000 Premium Requests / month',
      'Specialized Reasoning Models',
      'Maximum Context (200k+)',
      'Priority Generation Speed'
    ],
    buttonText: 'UPGRADE TO MAX',
    highlight: false
  },
  {
    name: 'TEAM',
    priceMonthly: 149,
    priceYearly: 129,
    description: 'For collaborative intelligence (up to 5 seats).',
    features: [
      'Everything in Max',
      'Multiplayer Real-time Canvas',
      'Shared Team Memory',
      'Centralized Admin Controls',
      'Priority Support'
    ],
    buttonText: 'CONTACT SALES',
    highlight: false
  }
]

useSeoMeta({
  title: 'Pricing - Bubbles',
  description: 'Simple, transparent pricing for your persistent AI workspace. Compare the Base, Pro, Max, and Team plans.',
  ogTitle: 'Pricing - Bubbles',
  ogDescription: 'Simple, transparent pricing for your persistent AI workspace. Compare the Base, Pro, Max, and Team plans.',
  twitterTitle: 'Pricing - Bubbles',
  twitterDescription: 'Simple, transparent pricing for your persistent AI workspace. Compare the Base, Pro, Max, and Team plans.',
})
</script>

<template>
  <div class="pricing-page">
    <MarketingNav />

    <div class="pricing-header">
      <h1 class="page-title">PRICING</h1>
      <p class="page-subtitle">Simple, transparent pricing for persistent intelligence.</p>

      <div class="billing-toggle">
        <span class="toggle-label" :class="{ active: !isYearly }">MONTHLY</span>
        <button class="toggle-switch" @click="isYearly = !isYearly" :aria-pressed="isYearly">
          <div class="toggle-knob" :class="{ right: isYearly }" />
        </button>
        <span class="toggle-label" :class="{ active: isYearly }">
          YEARLY <span class="discount-badge">SAVE 20%</span>
        </span>
      </div>
    </div>

    <div class="plans-grid">
      <div 
        v-for="tier in tiers" 
        :key="tier.name"
        class="plan-card"
        :class="{ 'plan-highlight': tier.highlight }"
      >
        <!-- Background elements for highlight glow -->
        <div v-if="tier.highlight" class="highlight-glow" aria-hidden="true" />
        <div class="plan-inner">
          <div class="plan-top">
            <h3 class="plan-name">{{ tier.name }}</h3>
            <div class="plan-price-wrapper">
              <span class="currency">$</span>
              <span class="price">{{ isYearly ? tier.priceYearly : tier.priceMonthly }}</span>
              <span class="period">/ MO</span>
            </div>
            <p class="plan-desc">{{ tier.description }}</p>
          </div>

          <div class="plan-divider" />

          <ul class="plan-features">
            <li v-for="feature in tier.features" :key="feature" class="feature-item">
              <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <button class="plan-button" :class="{ 'btn-primary': tier.highlight }">
            {{ tier.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-page {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  width: 100%;
  padding: 120px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-base);
  color: var(--text-primary);
}

/* ── Header ── */
.pricing-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 80px;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.page-title {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 12px;
  color: var(--text-muted);
  margin: 0 0 16px 12px; /* Offset for letter spacing */
}

.page-subtitle {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  margin: 0 0 48px 0;
  max-width: 400px;
}

/* ── Toggle ── */
.billing-toggle {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--text-muted);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-label.active {
  color: var(--text-primary);
}

.discount-badge {
  background: hsla(152, 60%, 45%, 0.15);
  color: hsl(152, 60%, 55%);
  padding: 4px 8px;
  border-radius: 99px;
  font-size: 9px;
  letter-spacing: 1px;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px;
  cursor: pointer;
  position: relative;
  transition: background 0.3s ease;
}

html.light .toggle-switch {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.toggle-knob {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--text-primary);
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.toggle-knob.right {
  transform: translateX(20px);
}

/* ── Grid ── */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
}

@media (max-width: 1024px) {
  .plans-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Cards ── */
.plan-card {
  position: relative;
  contain: layout style;
  animation: fade-in-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.plan-card:nth-child(1) { animation-delay: 100ms; }
.plan-card:nth-child(2) { animation-delay: 200ms; }
.plan-card:nth-child(3) { animation-delay: 300ms; }
.plan-card:nth-child(4) { animation-delay: 400ms; }

.plan-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 32px;
  background: var(--bg-base);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1), border-color 0.3s ease;
}

html.light .plan-inner {
  border-color: rgba(0, 0, 0, 0.08);
}

.plan-card:hover .plan-inner {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.15);
}

html.light .plan-card:hover .plan-inner {
  border-color: rgba(0, 0, 0, 0.15);
}

/* Highlight Tier Styling */
.plan-highlight .plan-inner {
  border-color: rgba(255, 255, 255, 0.2);
}

html.light .plan-highlight .plan-inner {
  border-color: rgba(0, 0, 0, 0.2);
}

.highlight-glow {
  position: absolute;
  inset: -1px;
  z-index: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent, rgba(255,255,255,0.4));
  filter: blur(12px);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

html.light .highlight-glow {
  background: linear-gradient(135deg, rgba(0,0,0,0.1), transparent, rgba(0,0,0,0.1));
}

.plan-card:hover .highlight-glow {
  opacity: 0.8;
}

/* ── Card Content ── */
.plan-top {
  margin-bottom: 32px;
}

.plan-name {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 4px;
  color: var(--text-muted);
  margin: 0 0 24px 0;
}

.plan-price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 16px;
}

.currency {
  font-size: 20px;
  font-weight: 300;
  color: var(--text-secondary);
}

.price {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -2px;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.period {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--text-muted);
}

.plan-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
  min-height: 44px;
}

.plan-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 0 32px 0;
}

html.light .plan-divider {
  background: rgba(0, 0, 0, 0.08);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.check-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--text-primary);
}

/* ── Buttons ── */
.plan-button {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

html.light .plan-button {
  border-color: rgba(0, 0, 0, 0.2);
}

.plan-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}

html.light .plan-button:hover {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.4);
}

.plan-button.btn-primary {
  background: var(--text-primary);
  color: var(--bg-base);
  border: none;
}

.plan-button.btn-primary:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

/* ── Animations ── */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
