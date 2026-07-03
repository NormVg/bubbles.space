<template>
  <div class="legal-page">
    <div class="legal-container">
      <div class="legal-header">
        <NuxtLink to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Bubbles
        </NuxtLink>
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: July 2026</p>
      </div>

      <div class="legal-content">
        <section>
          <h2>1. Introduction</h2>
          <p>At bubbles.space, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI canvas application.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, which you give to us when you register via Google authentication.</li>
            <li><strong>Canvas Data:</strong> The text, widgets, and layout data you actively create on your canvas. This data is stored securely in our database to ensure persistence across your sessions.</li>
            <li><strong>AI Interactions:</strong> Conversations and prompts sent to the Bubbles AI. We do not use your personal workspace data to train external models.</li>
          </ul>
        </section>

        <section>
          <h2>3. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Deliver targeted, context-aware AI assistance through your `user.md` and `soul.md` profiles.</li>
            <li>Sync your spatial canvas across devices.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
        </section>

        <section>
          <h2>5. Your Data Rights</h2>
          <p>Depending on your location, you may have the right to request access to the personal data we hold about you, to request that your personal data be corrected or deleted, and to request that we restrict the processing of your data.</p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at privacy@bubbles.space.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
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
