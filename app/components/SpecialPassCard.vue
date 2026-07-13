<script setup lang="ts">
interface Props {
  passType: 'founder_pass' | 'sponsor'
  userName: string
  userEmail: string
}

const props = defineProps<Props>()

const isFounder = computed(() => props.passType === 'founder_pass')

const initials = computed(() => {
  const parts = props.userName.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return props.userName.slice(0, 2).toUpperCase()
})
</script>

<template>
  <div class="pass-card" :class="passType">
    <!-- Shimmer line on hover -->
    <div class="shimmer" aria-hidden="true" />

    <!-- Top: brand mark -->
    <div class="pass-row pass-top">
      <span class="brand-mark">BUBBLES</span>
      <span class="pass-tier">{{ isFounder ? 'TIER I' : 'TIER II' }}</span>
    </div>

    <!-- Center: pass identity -->
    <div class="pass-center">
      <span class="pass-type-label">{{ isFounder ? 'FOUNDING MEMBER' : 'EARLY BACKER' }}</span>
      <div class="pass-divider" />
      <h3 class="pass-name">{{ isFounder ? "FOUNDER'S PASS" : "SPONSOR'S PASS" }}</h3>
    </div>

    <!-- Bottom: holder info -->
    <div class="pass-row pass-bottom">
      <div class="holder">
        <span class="holder-label">HOLDER</span>
        <span class="holder-name">{{ userName }}</span>
      </div>
      <div class="holder-id">
        <span class="holder-label">ID</span>
        <span class="holder-name">{{ isFounder ? '#F' : '#S' }}001</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pass-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1.6 / 1;
  border-radius: 0;
  overflow: hidden;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;
  user-select: none;

  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);

  transition: border-color 300ms cubic-bezier(0.19, 1, 0.22, 1);

  contain: layout style;
}

html.light .pass-card {
  border-color: rgba(0, 0, 0, 0.06);
}

.pass-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

html.light .pass-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
}

/* ── Shimmer line ── */
.shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 40%,
    rgba(255, 255, 255, 0.14) 50%,
    rgba(255, 255, 255, 0.08) 60%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.19, 1, 0.22, 1);
}

html.light .shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.04) 40%,
    rgba(0, 0, 0, 0.08) 50%,
    rgba(0, 0, 0, 0.04) 60%,
    transparent 100%
  );
}

.pass-card:hover .shimmer {
  opacity: 1;
  animation: shimmer-slide 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes shimmer-slide {
  from { left: -60%; }
  to { left: 120%; }
}

/* ── Founder accent: very subtle warm emerald bottom-left glow ── */
.founder_pass::before {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(ellipse at center, hsla(152, 50%, 40%, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Sponsor accent: very subtle cool blue bottom-left glow ── */
.sponsor::before {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(ellipse at center, hsla(213, 70%, 50%, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Rows ── */
.pass-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.pass-top {
  animation: row-enter 500ms 80ms cubic-bezier(0.19, 1, 0.22, 1) both;
}

.pass-bottom {
  animation: row-enter 500ms 250ms cubic-bezier(0.19, 1, 0.22, 1) both;
}

@keyframes row-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Brand ── */
.brand-mark {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 4px;
  color: var(--text-muted);
}

.pass-tier {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 2px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── Center ── */
.pass-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
  animation: center-enter 600ms 150ms cubic-bezier(0.19, 1, 0.22, 1) both;
}

@keyframes center-enter {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.pass-type-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 3px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.pass-divider {
  width: 24px;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

html.light .pass-divider {
  background: rgba(0, 0, 0, 0.08);
}

.pass-name {
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 6px;
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

html.light .pass-name {
  font-weight: 400;
}

/* ── Holder ── */
.holder,
.holder-id {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.holder-id {
  text-align: right;
}

.holder-label {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.holder-name {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .pass-card {
    padding: 24px;
    aspect-ratio: auto;
    min-height: 200px;
  }

  .pass-name {
    font-size: 17px;
    letter-spacing: 4px;
  }
}
</style>
