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
    <!-- Rotating white border beam -->
    <div class="border-glow" aria-hidden="true">
      <div class="border-glow-beam" />
    </div>

    <!-- Static constant border -->
    <div class="border-base" aria-hidden="true" />

    <!-- Card content -->
    <div class="pass-inner">
      <!-- Top: brand mark -->
      <div class="pass-row pass-top">
        <span class="brand-mark">BUBBLES</span>
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
/* ── Wrapper ── */
.pass-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;
  contain: layout style;
}

/* ── Rotating border beam — neutral white, no color ── */
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
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 65%,
    rgba(255, 255, 255, 0.06) 74%,
    rgba(255, 255, 255, 0.14) 78%,
    rgba(255, 255, 255, 0.06) 82%,
    transparent 90%,
    transparent 100%
  );
  animation: border-rotate 5s linear infinite;
}

html.light .border-glow-beam {
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 65%,
    rgba(0, 0, 0, 0.04) 74%,
    rgba(0, 0, 0, 0.10) 78%,
    rgba(0, 0, 0, 0.04) 82%,
    transparent 90%,
    transparent 100%
  );
}

/* Sponsor: golden beam */
.sponsor .border-glow-beam {
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 55%,
    hsla(40, 80%, 50%, 0.15) 64%,
    hsla(38, 90%, 55%, 0.45) 74%,
    hsla(35, 85%, 50%, 0.45) 80%,
    hsla(40, 80%, 50%, 0.15) 88%,
    transparent 95%,
    transparent 100%
  );
}

html.light .sponsor .border-glow-beam {
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.05) 70%,
    rgba(0, 0, 0, 0.14) 76%,
    rgba(0, 0, 0, 0.05) 82%,
    transparent 90%,
    transparent 100%
  );
}

@keyframes border-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Static constant border ── */
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

.sponsor .border-base {
  border-color: rgba(255, 255, 255, 0.08);
}

html.light .sponsor .border-base {
  border-color: rgba(0, 0, 0, 0.08);
}

/* ── Inner card ── */
.pass-inner {
  position: relative;
  z-index: 2;
  aspect-ratio: 1.6 / 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--bg-base, #0A0A0A);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: default;
  user-select: none;
}

html.light .pass-inner {
  background: var(--bg-base, #FFFFFF);
  border-color: rgba(0, 0, 0, 0.08);
}

/* ── Sponsor premium elevation: layered box shadow with gold tint ── */
.sponsor {
  box-shadow:
    0 0 0 1px hsla(38, 80%, 50%, 0.08),
    0 2px 8px hsla(38, 90%, 55%, 0.04),
    0 8px 40px hsla(38, 85%, 50%, 0.06);
}

html.light .sponsor {
  box-shadow:
    0 0 0 1px hsla(38, 80%, 50%, 0.15),
    0 2px 8px hsla(38, 90%, 55%, 0.08),
    0 8px 40px hsla(38, 85%, 50%, 0.12);
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

/* Sponsor tier label slightly more visible */
.sponsor .pass-tier {
  color: var(--text-secondary);
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
  color: var(--text-muted);
  text-transform: uppercase;
}

.pass-divider {
  width: 24px;
  height: 1px;
  margin: 4px 0;
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

/* Sponsor name: slightly brighter, feels more prominent */
.sponsor .pass-name {
  font-weight: 300;
  letter-spacing: 7px;
}

.pass-status {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 3px;
  color: var(--text-muted);
  margin-top: 4px;
  opacity: 0.6;
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
