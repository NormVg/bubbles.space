# Bubbles.Space Project Specific Rules

This rule file is a living document based on the `AGENTS.md` reference and tracks specific architectural decisions, UI/UX polish guidelines, and context management strategies specific to the bubbles.space workspace.

## 1. Context & Payload Management
- **Never dump raw widget data into the system prompt.** Dumping large markdown files, flowchart definitions, or diagram payloads directly into the `<system_context>` causes context bloat and breaks AI capabilities, especially in voice mode.
- **Provide Lightweight Inventories:** The system context should only contain a minimal inventory of available tools or widgets (e.g. `Widget ID`, `Title`, `Type`, `Coordinates`).
- **Use On-Demand Tools:** For reading actual content, the AI MUST use the `canvas_read_widget` tool to fetch data dynamically when needed.

## 2. Voice-to-Voice Feature Parity
- **Voice is a First-Class Citizen:** Any feature added to the text chat interface (e.g., attaching widget contexts, setting system prompts) MUST also be supported in the voice agent pipeline (`useVoiceAgent.ts`).
- **Context Injection:** When sending voice transcripts to the `eveAgent`, always ensure the same `systemBlock` and `widgetContextPrefix` are injected precisely as they are in `ChatInterface.vue`.

## 3. UI/UX Polish and State Management
- **Immediate Visual Feedback:** Always provide immediate visual confirmation of user actions. If a user clicks "Add to chat" on a widget, the Voice HUD or relevant UI must expand instantly, even before an AI response begins.
- **Prevent State Flashing:** Carefully manage AI response views during transitions. Specifically, hide old/leftover AI messages while a new message is in the `'submitted'` or loading state to prevent flashing stale data to the user.
- **Animations (Reference from AGENTS.md):** 
  - Break down animations into small, different segments that complete at different rates so the app feels alive, rich, and not monotonous.
  - Always use `<TransitionGroup>` for lists and dynamic elements (like context pills) so they animate smoothly when entering or leaving the DOM.

## 4. Tool Architecture (Static vs. Dynamic)
- **Strict Boundary:** Maintain a rigid separation between Core System Tools and future Dynamic User Tools.
- **Core System Tools (Current State):** Tools essential to the platform's functionality (like canvas manipulation, weather, core integrations) MUST remain statically defined in the codebase. This guarantees they are 100% reliable, type-safe, and under our absolute control.
- **Dynamic User Tools (Future State):** When designing future architectures (like database schemas or agent initializers), always leave room for BYOT (Bring Your Own Tool). Dynamic tools will be injected into the agent at runtime from a database or API (like MCP), but they must NEVER mix with or override the core system tools.
