<script setup lang="ts">
interface Props {
  passType: 'founder_pass' | 'sponsor'
  userName: string
  userEmail: string
}

const props = defineProps<Props>()

const passConfig = computed(() => {
  if (props.passType === 'sponsor') {
    return {
      label: 'SPONSOR',
      tagline: 'EARLY BACKER',
      tier: 'II',
      accentHsl: '213, 80%, 58%',
      glowColor: 'hsla(213, 80%, 58%, 0.12)',
      borderGradient: 'linear-gradient(135deg, hsl(213, 80%, 60%), hsl(240, 60%, 55%), hsl(213, 80%, 45%))',
    }
  }
  return {
    label: 'FOUNDER',
    tagline: 'FOUNDING MEMBER',
    tier: 'I',
    accentHsl: '152, 68%, 44%',
    glowColor: 'hsla(152, 68%, 44%, 0.12)',
    borderGradient: 'linear-gradient(135deg, hsl(152, 68%, 50%), hsl(170, 60%, 40%), hsl(152, 68%, 36%))',
  }
})

const initials = computed(() => {
  const parts = props.userName.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return props.userName.slice(0, 2).toUpperCase()
})
</script>

<template>
  <div
    class="pass-card"
    :class="passType"
    :style="{
      '--accent-hsl': passConfig.accentHsl,
      '--glow-color': passConfig.glowColor,
    }"
  >
    <!-- Subtle noise texture -->
    <div class="pass-noise" aria-hidden="true" />

    <!-- Ambient glow -->
    <div class="pass-glow" aria-hidden="true" />

    <!-- Top row: branding + tier -->
    <div class="pass-header">
      <div class="pass-brand">
        <span class="brand-dot" />
        <span class="brand-name">BUBBLES</span>
      </div>
      <span class="pass-tier">{{ passConfig.tier }}</span>
    </div>

    <!-- Center: pass label -->
    <div class="pass-body">
      <span class="pass-tagline">{{ passConfig.tagline }}</span>
      <h3 class="pass-label">{{ passConfig.label }}'S PASS</h3>
    </div>

    <!-- Bottom: user info -->
    <div class="pass-footer">
      <div class="user-info">
        <div class="user-initials">{{ initials }}</div>
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-email">{{ userEmail }}</span>
        </div>
      </div>
      <div class="pass-number">#{{ passType === 'sponsor' ? 'S' : 'F' }}001</div>
    </div>
  </div>
</template>

<style scoped>
.pass-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1.586 / 1; /* credit card ratio */
  border-radius: 12px;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;
  user-select: none;

  /* Premium surface */
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%),
    #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.50),
    0 8px 32px rgba(0, 0, 0, 0.35);

  /* Stagger entrance animations */
  animation: card-enter 600ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
  opacity: 0;

  contain: layout style;
}

html.light .pass-card {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%),
    #F7F7F6;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.06);
}

/* Hover lift */
.pass-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.60),
    0 20px 64px rgba(0, 0, 0, 0.40);
  transition: transform 200ms cubic-bezier(0.19, 1, 0.22, 1),
              box-shadow 200ms cubic-bezier(0.19, 1, 0.22, 1);
}

html.light .pass-card:hover {
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.12),
    0 20px 64px rgba(0, 0, 0, 0.08);
}

/* Noise overlay */
.pass-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  mix-blend-mode: overlay;
  pointer-events: none;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 128px 128px;
}

/* Ambient glow — different per tier */
.pass-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 400ms cubic-bezier(0.19, 1, 0.22, 1);
}

.pass-card:hover .pass-glow {
  opacity: 1;
}

.founder_pass .pass-glow {
  background:
    radial-gradient(ellipse 70% 50% at 15% 85%, hsla(152, 68%, 44%, 0.10) 0%, transparent 70%),
    radial-gradient(ellipse 50% 60% at 85% 20%, hsla(170, 60%, 40%, 0.06) 0%, transparent 60%);
}

.sponsor .pass-glow {
  background:
    radial-gradient(ellipse 70% 50% at 15% 85%, hsla(213, 80%, 58%, 0.10) 0%, transparent 70%),
    radial-gradient(ellipse 50% 60% at 85% 20%, hsla(240, 60%, 55%, 0.06) 0%, transparent 60%);
}

/* ── Header ── */
.pass-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  animation: fade-slide-in 400ms 100ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
  opacity: 0;
}

.pass-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: hsl(var(--accent-hsl));
  box-shadow: 0 0 8px hsla(var(--accent-hsl), 0.4);
  animation: dot-pulse 3s ease-in-out infinite;
}

.brand-name {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  color: var(--text-secondary);
}

.pass-tier {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 2px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── Body ── */
.pass-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
  animation: fade-slide-in 400ms 200ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
  opacity: 0;
}

.pass-tagline {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 3px;
  color: hsl(var(--accent-hsl));
  text-transform: uppercase;
}

.pass-label {
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 4px;
  color: var(--text-primary);
  margin: 0;
}

html.light .pass-label {
  font-weight: 400;
}

/* ── Footer ── */
.pass-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  animation: fade-slide-in 400ms 300ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
  opacity: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-initials {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  color: hsl(var(--accent-hsl));
  background: hsla(var(--accent-hsl), 0.10);
  border: 1px solid hsla(var(--accent-hsl), 0.15);
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-primary);
}

.user-email {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.pass-number {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 1px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── Animations ── */
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .pass-card {
    padding: 20px;
  }

  .pass-label {
    font-size: 17px;
    letter-spacing: 3px;
  }
}
</style>
</script>
