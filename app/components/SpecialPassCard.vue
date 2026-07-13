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
  <div class="pass-wrapper" :class="passType">
    <!-- Rotating border glow -->
    <div class="border-glow" aria-hidden="true">
      <div class="border-glow-beam" />
    </div>

    <!-- Static faint border underneath -->
    <div class="border-base" aria-hidden="true" />

    <!-- Card content -->
    <div class="pass-inner">
      <!-- Top: brand mark -->
      <div class="pass-row pass-top">
        <div class="brand-group">
          <span class="brand-dot" />
          <span class="brand-mark">BUBBLES</span>
        </div>
        <span class="pass-tier">{{ isFounder ? 'TIER I' : 'TIER II' }}</span>
      </div>

      <!-- Center: pass identity -->
      <div class="pass-center">
        <span class="pass-type-label">{{ isFounder ? 'FOUNDING MEMBER' : 'EARLY BACKER · SPONSOR' }}</span>
        <div class="pass-divider" />
        <h3 class="pass-name">{{ isFounder ? "FOUNDER'S PASS" : "SPONSOR'S PASS" }}</h3>
        <span class="pass-status">VERIFIED · 2026</span>
      </div>

      <!-- Bottom: holder info -->
      <div class="pass-row pass-bottom">
        <div class="holder">
          <span class="holder-label">HOLDER</span>
          <span class="holder-name">{{ userName }}</span>
        </div>
        <div class="holder-id">
          <span class="holder-label">PASS</span>
          <span class="holder-name">{{ isFounder ? '#F' : '#S' }}001</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Wrapper: positions the border glow behind the card ── */
.pass-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;
  contain: layout style;
}

/* ── Rotating border glow ── */
.border-glow {
  position: absolute;
  inset: -1px;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.border-glow-beam {
  position: absolute;
  inset: -50%;
  animation: border-rotate 6s linear infinite;
}

/* Founder: subtle emerald sweep */
.founder_pass .border-glow-beam {
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 60%,
    hsla(152, 60%, 45%, 0.25) 72%,
    hsla(152, 60%, 45%, 0.45) 78%,
    hsla(170, 50%, 40%, 0.25) 84%,
    transparent 92%,
    transparent 100%
  );
}

/* Sponsor: richer dual-tone blue-violet sweep with more presence */
.sponsor .border-glow-beam {
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 50%,
    hsla(220, 70%, 55%, 0.3) 60%,
    hsla(250, 60%, 60%, 0.55) 70%,
    hsla(280, 50%, 55%, 0.55) 78%,
    hsla(220, 70%, 55%, 0.3) 86%,
    transparent 94%,
    transparent 100%
  );
}

@keyframes border-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Static faint border base ── */
.border-base {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
  pointer-events: none;
  z-index: 1;
}

html.light .border-base {
  border-color: rgba(0, 0, 0, 0.06);
}

/* Sponsor gets a slightly more visible base border */
.sponsor .border-base {
  border-color: rgba(255, 255, 255, 0.08);
}

html.light .sponsor .border-base {
  border-color: rgba(0, 0, 0, 0.08);
}

/* ── Inner card content ── */
.pass-inner {
  position: relative;
  z-index: 2;
  aspect-ratio: 1.6 / 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--bg-base, #0A0A0A);
  cursor: default;
  user-select: none;
}

html.light .pass-inner {
  background: var(--bg-base, #FFFFFF);
}

/* Sponsor: very subtle inner ambient glow */
.sponsor .pass-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 40% at 50% 100%, hsla(250, 50%, 55%, 0.03) 0%, transparent 60%);
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
  animation: row-enter 500ms 300ms cubic-bezier(0.19, 1, 0.22, 1) both;
}

@keyframes row-enter {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Brand group ── */
.brand-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-dot {
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  animation: dot-breathe 3s ease-in-out infinite;
}

.founder_pass .brand-dot {
  background: hsl(152, 60%, 45%);
  box-shadow: 0 0 6px hsla(152, 60%, 45%, 0.4);
}

.sponsor .brand-dot {
  background: hsl(250, 55%, 62%);
  box-shadow: 0 0 8px hsla(250, 55%, 62%, 0.5);
}

@keyframes dot-breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

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
  gap: 8px;
  position: relative;
  z-index: 1;
  animation: center-enter 600ms 180ms cubic-bezier(0.19, 1, 0.22, 1) both;
}

@keyframes center-enter {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.pass-type-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.founder_pass .pass-type-label {
  color: var(--text-muted);
}

.sponsor .pass-type-label {
  color: hsla(250, 45%, 65%, 0.7);
}

.pass-divider {
  width: 24px;
  height: 1px;
  margin: 4px 0;
}

.founder_pass .pass-divider {
  background: rgba(255, 255, 255, 0.08);
}

.sponsor .pass-divider {
  background: hsla(250, 45%, 60%, 0.15);
}

html.light .founder_pass .pass-divider {
  background: rgba(0, 0, 0, 0.08);
}

html.light .sponsor .pass-divider {
  background: hsla(250, 45%, 50%, 0.12);
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

/* Sponsor name gets a subtle glow */
.sponsor .pass-name {
  text-shadow: 0 0 24px hsla(250, 50%, 60%, 0.08);
}

.pass-status {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 3px;
  margin-top: 4px;
}

.founder_pass .pass-status {
  color: hsla(152, 40%, 50%, 0.5);
}

.sponsor .pass-status {
  color: hsla(250, 45%, 65%, 0.5);
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
  .pass-inner {
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
