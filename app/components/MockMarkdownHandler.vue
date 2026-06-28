<template>
  <div class="mock-markdown-handler">
    <div class="header">
      <div class="title">README.md</div>
      <div class="actions">
        <button class="action-btn">Edit</button>
      </div>
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
  padding: 12px 16px;
  color: var(--text-primary, #e2e1e8);
  font-family: var(--font-sans);
  min-width: 300px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(205, 198, 247, 0.8);
}

.action-btn {
  background: rgba(205, 198, 247, 0.1);
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  color: #cdc6f7;
  cursor: pointer;
  transition: background 0.12s, transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn:hover {
  background: rgba(205, 198, 247, 0.2);
}

.action-btn:active {
  transform: scale(0.96);
}

.content h2 {
  font-size: 14px;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.content p {
  font-size: 12px;
  margin: 0 0 10px 0;
  line-height: 1.5;
  color: rgba(226, 225, 232, 0.7);
}

.content ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: rgba(226, 225, 232, 0.7);
}

.content li {
  margin-bottom: 4px;
}
</style>
