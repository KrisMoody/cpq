<script setup lang="ts">
const props = defineProps<{
  quoteId?: string
  customerId?: string
}>()

const emit = defineEmits<{
  actionExecuted: []
}>()

const { chatMessages, isStreaming, streamingContent, sendChatMessage, clearChat, error } = useAIQuoteOptimizer()

const messageInput = ref('')
const chatContainer = ref<HTMLElement | null>(null)

type DisplayMessage = { role: 'user' | 'assistant'; content: string; isStreaming: boolean }

const displayMessages = computed((): DisplayMessage[] => {
  const messages = [...chatMessages.value]
  if (isStreaming.value && streamingContent.value) {
    // Show streaming content as a partial assistant message
    return [...messages.map((m) => ({ ...m, isStreaming: false })), { role: 'assistant' as const, content: streamingContent.value, isStreaming: true }]
  }
  return messages.map((m) => ({ ...m, isStreaming: false }))
})

async function handleSend() {
  if (!messageInput.value.trim() || isStreaming.value) return

  const message = messageInput.value.trim()
  messageInput.value = ''

  await sendChatMessage(message, {
    quoteId: props.quoteId,
    customerId: props.customerId,
  })

  // Emit when a message is processed (may have triggered actions)
  emit('actionExecuted')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// Scroll to bottom when messages change
watch(displayMessages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Chat Messages -->
    <div
      ref="chatContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]"
    >
      <!-- Empty State -->
      <div
        v-if="displayMessages.length === 0"
        class="flex flex-col items-center justify-center h-full text-center text-gray-500"
      >
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mb-3 text-gray-400" />
        <p class="text-sm font-medium">Start a conversation</p>
        <p class="text-xs mt-1">Ask questions about the quote or request changes</p>
      </div>

      <!-- Messages -->
      <div
        v-for="(message, index) in displayMessages"
        :key="index"
        class="flex gap-3"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- Assistant Avatar -->
        <div
          v-if="message.role === 'assistant'"
          class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
        >
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>

        <!-- Message Bubble -->
        <div
          class="max-w-[80%] rounded-lg px-4 py-2"
          :class="{
            'bg-primary-500 text-white': message.role === 'user',
            'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100': message.role === 'assistant',
          }"
        >
          <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
          <!-- Streaming Indicator -->
          <span
            v-if="message.isStreaming"
            class="inline-block w-2 h-4 ml-1 bg-gray-600 dark:bg-gray-400 animate-pulse"
          />
        </div>

        <!-- User Avatar -->
        <div
          v-if="message.role === 'user'"
          class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        >
          <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
      </div>

      <!-- Tool Execution Indicator -->
      <div
        v-if="isStreaming && !streamingContent"
        class="flex items-center gap-2 text-gray-500"
      >
        <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 animate-spin" />
        <span class="text-sm">AI is thinking...</span>
      </div>
    </div>

    <!-- Error Alert -->
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      class="mx-4 mb-2"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Input Area -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-end gap-2">
        <UTextarea
          v-model="messageInput"
          placeholder="Ask about this quote..."
          :rows="1"
          autoresize
          :maxrows="4"
          :disabled="isStreaming"
          class="flex-1"
          @keydown="handleKeydown"
        />
        <UButton
          :loading="isStreaming"
          :disabled="!messageInput.trim() || isStreaming"
          icon="i-heroicons-paper-airplane"
          @click="handleSend"
        />
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center gap-2 mt-2">
        <UButton
          variant="ghost"
          size="xs"
          icon="i-heroicons-trash"
          :disabled="chatMessages.length === 0 || isStreaming"
          @click="clearChat"
        >
          Clear chat
        </UButton>
      </div>
    </div>
  </div>
</template>
