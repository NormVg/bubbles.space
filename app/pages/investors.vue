<script setup lang="ts">
import { computed } from 'vue'

const manifestoContent = `# Bubbles: The Personal OS Manifesto

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

### [1] Founder's Pass / Supporter ($100)

* Instant access to the private beta.
* Lifetime Pro Status (no subscriptions).
* Access to the private developer group.
* Early access to ecosystem applications.

[ -> Fund & Get Founder's Pass ](/api/checkout/founder-pass)

### [2] Early Backer / Sponsor ($500+)

* All perks of the Founder's Pass.
* Direct line to the core engineering team.
* Priority feature requests.
* Lifetime supporter recognition.
* Name/Logo on "Sponsors" Wall.

[ -> Fund & Become a Sponsor ](/api/checkout/sponsor)

### [3] Angel Investor (Custom)

* Equity discussions.
* Quarterly founder updates.
* Deep architectural access.
* Private roadmap sessions.
* Early API partnerships.
* Access to ecosystem and platform strategy discussions.

[ -> Discuss Angel Investment ](mailto:thenormvg.work@gmail.com)

---

# COMPANY SNAPSHOT

**Company:** Bubbles
**Stage:** Bootstrapped
**Category:** Personal AI & Agentic Computing
**Vision:** Build the personal operating system for the AI era.
**Approach:** Ecosystem of agent-first applications powered by a shared intelligence layer.

---

> **We're building Bubbles, a proactive AI companion and ecosystem of agent-first applications, so people can delegate their digital lives and focus on what truly matters.**

`

// Extract headings for the TOC
const toc = computed(() => {
  const headings = []
  const lines = manifestoContent.split('\n')
  for (const line of lines) {
    if (line.startsWith('# ')) {
      const title = line.replace('# ', '').trim()
      if (title.startsWith('Bubbles:')) continue // Skip the main title
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      headings.push({ title, id })
    }
  }
  return headings
})

// Parse markdown just enough for TOC navigation and links
const parsedManifesto = computed(() => {
  let parsed = manifestoContent

  // 1. TOC Headings (H2)
  for (const item of toc.value) {
    const regex = new RegExp(`^# ${item.title}$`, 'gm')
    parsed = parsed.replace(regex, `<span id="${item.id}" class="heading-anchor"># ${item.title}</span>`)
  }

  // 2. Clickable Links [text](url)
  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">[$1]</a>')

  return parsed
})

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="legal-page">
    <MarketingNav />
    <div class="layout-container">

      <!-- Sidebar TOC -->
      <aside class="sidebar">

        <div class="toc-title">INDEX</div>
        <ul class="toc-list">
          <li v-for="item in toc" :key="item.id">
            <a :href="`#${item.id}`" @click.prevent="scrollTo(item.id)">{{ item.title }}</a>
          </li>
        </ul>
      </aside>

      <!-- Main Document -->
      <main class="main-content">
        <div class="md-content" v-html="parsedManifesto"></div>
        <NuxtLink to="/" class="md-link">[Back to Bubbles]</NuxtLink> | <a href="mailto:founders@tao.hq" class="md-link">[Initialize Contact]</a>
      </main>

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
  scroll-behavior: smooth;
}

.layout-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  gap: 64px;
  align-items: flex-start;
}

/* Sidebar styling */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 0px;
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
  margin-bottom: 48px;
}

.back-link:hover {
  color: var(--text-primary);
}

.toc-title {
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toc-list a {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  display: block;
}

.toc-list a:hover {
  color: var(--text-primary);
}

.main-content {
  flex-grow: 1;
  max-width: 680px;
}

/* Specific Markdown Styling */
.md-content {
  font-family: var(--font-mono), monospace;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

:deep(.heading-anchor) {
  scroll-margin-top: 40px;
  color: var(--text-primary);
  font-weight: 500;
}

:deep(.md-link) {
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-color: var(--border-color);
  text-underline-offset: 4px;
  transition: all 0.2s ease;
}

:deep(.md-link:hover) {
  color: var(--text-secondary);
}

.md-link {
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-color: var(--border-color);
  text-underline-offset: 4px;
  transition: all 0.2s ease;
}

.md-link:hover {
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 860px) {
  .layout-container {
    flex-direction: column;
    gap: 32px;
  }
  .sidebar {
    position: relative;
    width: 100%;
  }
  .back-link {
    margin-bottom: 24px;
  }
}
</style>
