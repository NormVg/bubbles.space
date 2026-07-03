<template>
  <div class="legal-page">
    <div class="legal-container">
      <div class="legal-header">
        <NuxtLink to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Bubbles
        </NuxtLink>
        <h1>Terms of Service</h1>
        <p class="last-updated">Last Updated: July 2026</p>
      </div>

      <div class="legal-content">
        <section>
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using bubbles.space ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.</p>
        </section>

        <section>
          <h2>2. The Service</h2>
          <p>bubbles.space provides a spatial, canvas-based AI workspace. The Service is provided "as is" and "as available". We reserve the right to modify, suspend, or discontinue the Service at any time without notice.</p>
        </section>

        <section>
          <h2>3. User Accounts & Data</h2>
          <p>You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. Bubbles relies on local context and cloud synchronization. You retain all rights to the data you create on your canvas.</p>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any local, state, national, or international law.</li>
            <li>Transmit any material that is abusive, harassing, tortious, defamatory, vulgar, pornographic, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
          </ul>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of bubbles.space and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of bubbles.space.</p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>In no event shall bubbles.space, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 80px 24px;
}

.legal-container {
  max-width: 680px;
  margin: 0 auto;
}

.legal-header {
  margin-bottom: 64px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-primary);
}

.legal-header h1 {
  font-size: 40px;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin: 0 0 12px 0;
}

.last-updated {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.legal-content section {
  margin-bottom: 48px;
}

.legal-content h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

.legal-content p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
}

.legal-content ul {
  padding-left: 20px;
  margin: 0;
}

.legal-content li {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
</style>
