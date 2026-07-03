<template>
  <div class="investors-page">
    <div class="investors-container">
      <div class="header">
        <NuxtLink to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Bubbles
        </NuxtLink>
        <div class="badge">BACK THE FUTURE</div>
        <h1>Investors & Sponsors</h1>
        <p class="subtitle">Join us in building the most aesthetic, spatial AI workspace. Support the development of Bubbles and secure your place in our founding community.</p>
      </div>

      <div class="tiers-grid">
        <!-- Tier 1: Founder's Pass -->
        <div class="tier-card">
          <div class="tier-header">
            <h3>Founder's Pass</h3>
            <div class="price">$49 <span>One-time</span></div>
            <p>For individuals who want early access and lifetime perks.</p>
          </div>
          <ul class="tier-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Instant Private Beta Access</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Lifetime Pro Status</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> "Founding Member" In-App Badge</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Private Dev Discord Access</li>
          </ul>
          <a href="#" class="tier-btn">Get Founder's Pass</a>
        </div>

        <!-- Tier 2: Early Sponsor -->
        <div class="tier-card highlight">
          <div class="tier-header">
            <h3>Early Sponsor</h3>
            <div class="price">$500+ <span>One-time</span></div>
            <p>For businesses and hardcore supporters who want a direct line to the team.</p>
          </div>
          <ul class="tier-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> All Founder's Pass Perks</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Direct Line to Dev Team</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Priority Feature Requests</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Name/Logo on "Sponsors" Wall</li>
          </ul>
          <a href="#" class="tier-btn primary">Become a Sponsor</a>
        </div>

        <!-- Tier 3: Angel Investor -->
        <div class="tier-card">
          <div class="tier-header">
            <h3>Angel Investor</h3>
            <div class="price">Custom <span>Funding</span></div>
            <p>For visionary investors interested in equity and deep partnerships.</p>
          </div>
          <ul class="tier-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Equity Discussions</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Board / Advisory Roles</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Deep Architectural Access</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Early API Integrations</li>
          </ul>
          <a href="#" class="tier-btn outline">Contact Us</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.investors-page {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 80px 24px;
}

.investors-container {
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 48px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-primary);
}

.header {
  text-align: center;
  margin-bottom: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: fade-in 1s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.badge {
  display: inline-block;
  background: rgba(168, 85, 247, 0.1);
  color: #A855F7;
  border: 1px solid rgba(168, 85, 247, 0.2);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 6px 14px;
  border-radius: 20px;
}

.header h1 {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--text-primary);
}

.subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0;
}

.tiers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  animation: fade-in 1s ease-out 0.2s forwards;
  opacity: 0;
}

.tier-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

html.light .tier-card {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.tier-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.1);
}

html.light .tier-card:hover {
  border-color: rgba(0, 0, 0, 0.15);
}

.tier-card.highlight {
  background: rgba(168, 85, 247, 0.03);
  border-color: rgba(168, 85, 247, 0.3);
  position: relative;
}

.tier-card.highlight::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #A855F7, #EC4899);
  border-radius: 20px 20px 0 0;
}

.tier-header {
  margin-bottom: 32px;
}

.tier-header h3 {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

.price {
  font-size: 40px;
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price span {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
}

.tier-header p {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  min-height: 42px;
}

.tier-features {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tier-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.tier-features svg {
  width: 18px;
  height: 18px;
  color: #A855F7;
  flex-shrink: 0;
}

.tier-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

html.light .tier-btn {
  background: rgba(0, 0, 0, 0.05);
}

.tier-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

html.light .tier-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.tier-btn.primary {
  background: var(--text-primary);
  color: var(--bg-base);
}

.tier-btn.primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.tier-btn.outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.light .tier-btn.outline {
  border-color: rgba(0, 0, 0, 0.1);
}

.tier-btn.outline:hover {
  border-color: var(--text-primary);
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 36px;
  }
}
</style>
