<template>
  <div class="mock-markdown-handler">
    <div class="header">
      <div class="title">README.md</div>
    </div>
    <div class="content">
      <h2>Project Overview</h2>
      <p>This is a dynamically loaded component simulating a markdown handler. It adjusts its size automatically.</p>
      <ul>
        <li>Supports dynamic height</li>
        <li>Supports dynamic width</li>
        <li>Smooth Maya animations</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.mock-markdown-handler {
  padding: 12px 20px; /* Aligned exactly with the tab text (10px switcher padding + 10px tab padding) */
  color: var(--text-primary);
  font-family: var(--font-sans);
  min-width: 300px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-subtle);
}

.title {
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
}

.content h2 {
  font-size: 14px;
  margin: 0 0 8px 0;
  font-weight: 600;
  color: var(--text-primary);
}

.content p {
  font-size: 12px;
  margin: 0 0 10px 0;
  line-height: 1.5;
  color: var(--text-secondary);
}

.content ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: var(--text-secondary);
}

.content li {
  margin-bottom: 4px;
}
</style>
