<script setup lang="ts">
const manifestoContent = `# Bubbles: The Personal OS Manifesto

---

# THE PHILOSOPHY

Software today is fragmented.

People spend their days switching between apps, managing tabs, copying information between tools, and manually coordinating their digital lives. AI has made software more capable, but most AI products still operate in a simple loop:

**You ask. It responds.**

We believe the next generation of computing will be fundamentally different.

It will be:

* Persistent.
* Context-aware.
* Proactive.
* Agent-driven.

At Bubbles, we're building a world where everyone has a personal AI companion that understands their goals, remembers their context, and works on their behalf.

Our vision isn't another chatbot or another productivity app.

Our vision is a new computing layer:

> **A personal AI that lives alongside you and quietly helps run your digital life.**

---

# THE PRODUCT

Bubbles is an always-on AI workspace and personal operating system.

It combines memory, context, agents, and intelligent workflows into a single experience that stays with you throughout your day.

Instead of managing software, users collaborate with an AI that understands their world.

### Core Principles

* Persistent memory and state
* Cross-device synchronization
* Deep personal context
* Proactive intelligence
* Human-in-the-loop control
* Long-term learning and adaptation
* Privacy and user ownership

### Core Capabilities

* AI-native workspace
* Personal memory engine
* Project and life management
* Autonomous agents
* Context engine
* Cross-application intelligence
* Extensible APIs and integrations

---

# THE ECOSYSTEM

Bubbles is not a single application.

We are building an ecosystem of **agent-first applications**, each designed to be valuable on its own while becoming exponentially more powerful together.

Every application contributes context, memory, and intelligence back into the Bubbles platform.

Think of it as:

> **Standalone apps individually. A personal operating system collectively.**

Examples include:

* Notes and knowledge management
* Personal planning and life management
* Communication and collaboration
* Research and information gathering
* Project management
* Creative workflows
* Personal organization tools

Each app follows three principles:

### Great standalone product

Users should love the app even if they never use the entire ecosystem.

### Agent-first experience

AI isn't a feature bolted on afterward. It is built into the core workflow.

### Shared intelligence

Every interaction improves the broader Bubbles experience.

As users adopt more of the ecosystem, their AI companion becomes increasingly useful, personalized, and capable.

This creates a powerful flywheel:

**More apps → More context → Better intelligence → Better user experience → More engagement.**

---

# WHY NOW

Several technology shifts are happening simultaneously:

* Foundation models have reached practical usefulness.
* The cost of intelligence continues to decline.
* Users are increasingly comfortable delegating tasks to AI.
* Software is transitioning from apps to agents.
* Context and memory are becoming the next competitive moat.

We believe the next decade will be defined by companies that successfully build trusted personal AI systems.

---

# MARKET OPPORTUNITY

The markets of productivity software, knowledge management, collaboration tools, and personal AI represent a multi-billion-dollar opportunity.

Our long-term ambition is larger than productivity software.

We believe every person will eventually have:

* A personal AI companion
* A persistent digital memory
* An intelligent operating layer between themselves and software

Bubbles is being built to become that layer.

---

# OUR ADVANTAGES

### Agent-first from day one

Not retrofitting AI into existing software.

### Memory as infrastructure

Long-term context is a core primitive.

### Ecosystem strategy

Products strengthen one another through shared intelligence.

### Persistent relationship with the user

Bubbles becomes more valuable over time.

### Long-term vision

Building a new computing platform rather than a single feature.

---

# ROADMAP

### Phase I

Launch the core workspace and memory engine.

### Phase II

Introduce proactive agents and autonomous workflows.

### Phase III

Launch the first ecosystem applications.

### Phase IV

Open APIs, integrations, and developer platform.

### Long-Term

Become the personal operating system for the AI era.

---

# WHAT WE EXPECT FROM A PARTNER

We're looking for partners who:

* Believe in long-term technology bets.
* Understand platform businesses and ecosystem effects.
* Can provide strategic guidance and network access.
* Have conviction in the future of AI-native computing.
* Want to help shape the next generation of human-computer interaction.

We are not looking for passive capital.

We're looking for partners who want to help build a category-defining company.

---

# THE ASK

We are currently accepting a limited number of early backers to accelerate product development and extend our runway.

### Use of Funds

* Core engineering and infrastructure
* AI research and model capabilities
* Product design and user experience
* Security and reliability
* Building the ecosystem applications
* Early team expansion

---

### [1] Founder's Pass / Supporter ($50)

* Instant access to the private beta.
* Lifetime Pro Status (no subscriptions).
* Access to the private developer group.
* Early access to ecosystem applications.

### [2] Early Backer / Sponsor ($500+)

* All perks of the Founder's Pass.
* Direct line to the core engineering team.
* Priority feature requests.
* Lifetime supporter recognition.
* Name/Logo on "Sponsors" Wall.

### [3] Angel Investor (Custom)

* Equity discussions.
* Quarterly founder updates.
* Deep architectural access.
* Private roadmap sessions.
* Early API partnerships.
* Access to ecosystem and platform strategy discussions.

---

# COMPANY SNAPSHOT

**Company:** Bubbles
**Stage:** Pre-Seed
**Category:** Personal AI & Agentic Computing
**Vision:** Build the personal operating system for the AI era.
**Approach:** Ecosystem of agent-first applications powered by a shared intelligence layer.

---

> **We're building Bubbles, a proactive AI companion and ecosystem of agent-first applications, so people can delegate their digital lives and focus on what truly matters.**

`
</script>

<template>
  <div class="legal-page">
    <div class="legal-container">
      <div class="legal-header">
        <NuxtLink to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Bubbles
        </NuxtLink>
      </div>

      <div class="md-content">
        {{ manifestoContent }}<NuxtLink to="/" class="md-link">[Back to Bubbles]</NuxtLink> | <a href="mailto:founders@tao.hq" class="md-link">[Initialize Contact]</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Inherit the exact layout from terms.vue */
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
  margin-bottom: 48px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-primary);
}

/* Specific Markdown Styling */
.md-content {
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre-wrap; /* Crucial for keeping raw markdown formatting */
}

.md-link {
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-color: var(--text-secondary);
  text-underline-offset: 4px;
  transition: opacity 0.2s ease;
}

.md-link:hover {
  opacity: 0.7;
}
</style>
