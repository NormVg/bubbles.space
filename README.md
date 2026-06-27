# 🫧 Bubbles.space

**Bubbles.space is a persistent AI workspace that's always open, always in sync, and helps you think, build, and get things done in the AI era.**

Stop managing apps. Open one space, stay there, and let AI help you get things done. That's Bubbles.space. It acts like a personal operating system powered by AI—your own Jarvis for work and life.

## 🚀 Tech Stack

This project is built using a modern, AI-first stack:
- **[Nuxt](https://nuxt.com/)**: The intuitive Vue framework, handling our frontend UI and server routes.
- **[Eve Framework](https://github.com/jagreehal/eve)**: A filesystem-first framework for durable backend AI agents.
- **[Ollama](https://ollama.com/)**: Running local, powerful language models (specifically `gemma4:31b-cloud`) via the Vercel AI SDK.

## 🛠️ Getting Started

### Prerequisites

1. Ensure you have Node.js and [pnpm](https://pnpm.io/) installed.
2. Install and start [Ollama](https://ollama.com/). Make sure you have the `gemma4:31b-cloud` model pulled and running.

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`. The Eve agent runs seamlessly alongside the Nuxt frontend, requiring no additional server startup.

## 📁 Project Structure

- `app/app.vue`: The main chat interface where you interact with the agent.
- `agent/agent.ts`: The Eve agent configuration and model definitions.
- `agent/channels/eve.ts`: Authentication and routing configurations for the agent.
- `.info2ai/`: Documentation and AI system prompts.

## 💡 Vision

Bubbles.space is an always-on AI workspace that remembers, syncs, and helps you get things done—like having your own Jarvis for the AI era.
