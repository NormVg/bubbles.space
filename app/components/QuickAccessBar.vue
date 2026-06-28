<template>
  <div class="quick-access-hud">
    <div class="curve-top" />
    <div class="quick-access-bar">
      <button class="qa-btn" title="Search">
        <LucideSearch class="icon" :size="18" />
      </button>
      <button class="qa-btn" title="Notifications">
        <LucideBell class="icon" :size="18" />
      </button>
      <button class="qa-btn" title="Settings">
        <LucideSettings class="icon" :size="18" />
      </button>
    </div>
    <div class="curve-left" />
  </div>
</template>

<script setup lang="ts">
// Icons are auto-imported via nuxt-lucide-icons using the Lucide prefix
</script>

<style scoped>
/* ─── HUD Wrapper Styling ──────────────────────────────────────── */
.quick-access-hud {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: var(--bg-soft);
  border-radius: 16px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Inverted curve for top-left touching the right frame */
.curve-top {
  position: absolute;
  top: -16px;
  right: 0;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 0 0, transparent 16px, var(--bg-soft) 16px);
  pointer-events: none;
}

/* Inverted curve for bottom-left touching the bottom frame */
.curve-left {
  position: absolute;
  bottom: 0;
  left: -16px;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 0 0, transparent 16px, var(--bg-soft) 16px);
  pointer-events: none;
}

/* ─── Bar Content Styling ──────────────────────────────────────── */
.quick-access-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
}

/* Button aesthetics copied from WorkspaceSwitcher tabs */
.qa-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qa-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.qa-btn:active {
  transform: scale(0.92);
}
</style>
