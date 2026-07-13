<script setup lang="ts">
useSeoMeta({
  title: 'Manifesto - Bubbles',
  description: 'The philosophy of Spatial AI. Why we are moving away from linear chat.',
})
</script>

<template>
  <div class="manifesto-page">
    <div class="manifesto-container">
      <NuxtLink to="/" class="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </NuxtLink>
      
      <article class="manifesto-content">
        <header class="manifesto-header">
          <p class="eyebrow">OUR PHILOSOPHY</p>
          <h1>The End of the Linear Chat.</h1>
        </header>

        <section class="manifesto-body">
          <p class="lead">For years, we've interacted with AI through a narrow, scrolling tube. A linear timeline of context that inevitably breaks.</p>
          
          <p>When you ask a complex question, the AI generates a brilliant answer. But as the conversation continues, that brilliance scrolls up, out of sight, and eventually out of the AI's context window. You are forced to repeat yourself, copy-paste previous answers, and constantly manage the AI's memory instead of focusing on your work.</p>

          <h2>Human thought is not linear. It is spatial.</h2>
          <p>We don't think in single-file chat bubbles. We think in webs, nodes, and connections. We lay papers out on a desk. We use whiteboards. We need to see the whole picture at once.</p>

          <p>Bubbles was built on a simple premise: <strong>Your AI should adapt to how you think, not the other way around.</strong></p>

          <h2>Persistence by Default.</h2>
          <p>If you tell an assistant your company's brand voice on Monday, you shouldn't have to remind it on Friday. Bubbles uses semantic memory to remember who you are, what you care about, and the context of your projects across every session and every canvas.</p>

          <h2>A Workspace, Not a Chatbot.</h2>
          <p>We are building an environment where AI models act as collaborators in a shared physical space. Where you can ask Llama 3 to analyze a PDF in one corner, while Mistral drafts an email based on that analysis in another.</p>

          <p class="conclusion">Welcome to the spatial era of computing. Welcome to Bubbles.</p>
        </section>
        
        <div class="manifesto-cta">
          <NuxtLink to="/pricing" class="btn-primary">GET YOUR PASS</NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.manifesto-page {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 80px 24px 120px;
}

.manifesto-container {
  max-width: 680px;
  margin: 0 auto;
  animation: fade-in-up 1s cubic-bezier(0.19, 1, 0.22, 1) both;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 64px;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-primary);
}

.manifesto-header {
  margin-bottom: 64px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 4px;
  color: var(--text-muted);
  margin: 0 0 16px 0;
}

.manifesto-header h1 {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
  color: var(--text-primary);
}

.manifesto-body .lead {
  font-size: 24px;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 48px;
}

.manifesto-body h2 {
  font-size: 24px;
  font-weight: 400;
  margin: 64px 0 24px 0;
  color: var(--text-primary);
}

.manifesto-body p {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.manifesto-body strong {
  color: var(--text-primary);
  font-weight: 500;
}

.conclusion {
  font-size: 20px !important;
  font-weight: 400;
  color: var(--text-primary) !important;
  margin-top: 64px;
}

.manifesto-cta {
  margin-top: 64px;
  padding-top: 64px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
}

html.light .manifesto-cta {
  border-color: rgba(0, 0, 0, 0.08);
}

.btn-primary {
  display: inline-flex;
  padding: 16px 32px;
  background: var(--text-primary);
  color: var(--bg-base);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.btn-primary:hover {
  transform: scale(1.02);
}

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

@media (max-width: 640px) {
  .manifesto-header h1 {
    font-size: 36px;
  }
  .manifesto-body .lead {
    font-size: 20px;
  }
  .manifesto-body p {
    font-size: 16px;
  }
}
</style>
