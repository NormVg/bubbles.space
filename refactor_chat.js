const fs = require('fs');
let code = fs.readFileSync('app/components/chat/ChatInterface.vue', 'utf8');

// 1. Template Replacements
code = code.replace(
  /<header class="chat-session-header">[\s\S]*?<\/header>/,
  `<ChatSessionHeader
      :showSessions="showSessions"
      :activeConversationTitle="activeConversationTitle"
      @toggle-sessions="toggleSessionsView"
      @create-chat="createChat"
    />`
);

code = code.replace(
  /<div v-if="activeContexts\.length > 0 \|\| chatStore\.pendingWidgetContexts\.length > 0" class="context-bar">[\s\S]*?<\/div>\s*<\/Transition>/,
  `<Transition name="fade-slide">
          <ChatContextBar
            v-if="activeContexts.length > 0 || chatStore.pendingWidgetContexts.length > 0"
            :activeContexts="activeContexts"
            :pendingWidgetContexts="chatStore.pendingWidgetContexts"
            @remove-context="removeContext"
            @remove-widget-context="chatStore.removeWidgetContext"
          />
        </Transition>`
);

code = code.replace(
  /<div v-if="message\.role === 'user'" class="user-message-wrapper">[\s\S]*?<\/div>\s*<\/div>/g,
  `<ChatMessageUser v-if="message.role === 'user'" :message="message" @copy="handleCopy(getTextContent(message), true)" />`
);

code = code.replace(
  /<div v-else-if="hasRenderableParts\(message\)" class="ai-message-wrapper">[\s\S]*?<\/div>\s*<\/div>/g,
  `<ChatMessageAI v-else-if="hasRenderableParts(message)" :message="message" :isDone="agent.status.value !== 'streaming'" @copy="handleCopy(getTextContent(message), false)" @reply="handleReply(message)" />`
);

// Add inner wrapper for ResizeObserver
code = code.replace(
  /<div class="chat-messages" ref="messagesContainer" @scroll="handleScroll">/,
  `<div class="chat-messages" ref="messagesContainer" @scroll="handleScroll">\n            <div class="chat-messages-inner" ref="messagesInner">`
);

code = code.replace(
  /<\/div>\s*<!-- Empty State -->/,
  `</div>\n          </div>\n\n          <!-- Empty State -->`
);


// 2. Script Replacements
code = code.replace(
  /import UserMessageQuotes from '\.\/UserMessageQuotes\.vue'/,
  `import ChatSessionHeader from './ChatSessionHeader.vue'\nimport ChatContextBar from './ChatContextBar.vue'\nimport ChatMessageUser from './ChatMessageUser.vue'\nimport ChatMessageAI from './ChatMessageAI.vue'`
);

// Remove unneeded imports
code = code.replace(/import UserMessageQuotes from '\.\/UserMessageQuotes\.vue'\n/, '');
code = code.replace(/import ToolCallGroup from '\.\/ToolCallGroup\.vue'\n/, '');

// Replace MutationObserver with ResizeObserver
const observerLogic = `const messagesInner = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function disconnectMessageObserver() {
  if (observerRaf !== null) {
    cancelAnimationFrame(observerRaf)
    observerRaf = null
  }
  resizeObserver?.disconnect()
  resizeObserver = null
}

function attachMessageObserver() {
  disconnectMessageObserver()
  if (messagesInner.value) {
    resizeObserver = new ResizeObserver(() => {
      if (observerRaf !== null) cancelAnimationFrame(observerRaf)
      observerRaf = requestAnimationFrame(() => {
        scrollToBottom(false)
        observerRaf = null
      })
    })
    resizeObserver.observe(messagesInner.value)
  }
}`;

code = code.replace(/let observer: MutationObserver \| null = null/, '');
code = code.replace(/function disconnectMessageObserver\(\) \{[\s\S]*?\}\n\nfunction attachMessageObserver\(\) \{[\s\S]*?\}\n/, observerLogic + '\n');


// Remove parsers
code = code.replace(/const cleanUserText = \(text: string\) => \{[\s\S]*?\}\n\n/, '');
code = code.replace(/type GroupedPart = [\s\S]*?const getGroupedParts = \(message: EveMessage\) => \{[\s\S]*?\}\n\n/, '');
code = code.replace(/const parseUserMessage = \(text: string\) => \{[\s\S]*?\}\n\n/g, '');

// The handleCopy cleanText fix:
code = code.replace(
  /const handleCopy = async \(text: string, isUser: boolean\) => \{[\s\S]*?\}\n\n/,
  `const handleCopy = async (text: string, isUser: boolean) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text);
    playCopySound();
    
    if (isUser) {
      userMessageCopied.value = true;
      setTimeout(() => { userMessageCopied.value = false }, 2000);
    } else {
      aiMessageCopied.value = true;
      setTimeout(() => { aiMessageCopied.value = false }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}\n\n`
);

// Remove extracted CSS
code = code.replace(/\/\* ─── Session Header ─── \*\/[\s\S]*?\/\* ─── Main View Switcher ─── \*\//, '/* ─── Main View Switcher ─── */');
code = code.replace(/\.context-bar \{[\s\S]*?\.context-clear:hover \{[\s\S]*?\}/, '');
code = code.replace(/\.user-message-wrapper \{[\s\S]*?\.chat-action-btn\.copied \{[\s\S]*?\}/, '');
code = code.replace(/\.ai-message-wrapper \{[\s\S]*?\.ai-message-wrapper:hover \.ai-message-actions \{[\s\S]*?\}/, '');
code = code.replace(/\.icon-success \{[\s\S]*?\}/, '');
code = code.replace(/@media \(max-width: 760px\) \{[\s\S]*?\.session-browser \{/, '@media (max-width: 760px) {\n  .session-browser {');

fs.writeFileSync('app/components/chat/ChatInterface.vue', code);
console.log('Refactored ChatInterface.vue');
