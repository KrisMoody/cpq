<script setup lang="ts">
import { useCourseProgress } from '~/composables/useCourseProgress'
import { useBreadcrumbLabel } from '~/composables/useBreadcrumbs'

const route = useRoute()
const router = useRouter()

const { modules, getModuleProgress, markModuleStarted, markModuleCompleted } = useCourseProgress()

// Get the module from route params
const moduleId = computed(() => route.params.moduleId as string)
const currentModule = computed(() => modules.find(m => m.id === moduleId.value))

// Redirect to course list if module not found
if (!currentModule.value) {
  navigateTo('/learn/course')
}

// Set custom breadcrumb label with module title
useBreadcrumbLabel(computed(() => currentModule.value?.title))

// Fetch module content
const { data: moduleData, pending, error } = await useFetch(() => `/api/course/${moduleId.value}`)

// Mark module as started when viewing
onMounted(() => {
  if (currentModule.value) {
    markModuleStarted(currentModule.value.id)
  }
})

// Get previous and next modules
const currentIndex = computed(() => modules.findIndex(m => m.id === moduleId.value))
const previousModule = computed(() => currentIndex.value > 0 ? modules[currentIndex.value - 1] : null)
const nextModule = computed(() => currentIndex.value < modules.length - 1 ? modules[currentIndex.value + 1] : null)

const progress = computed(() => currentModule.value ? getModuleProgress(currentModule.value.id) : { status: 'not_started' as const })
const isCompleted = computed(() => progress.value.status === 'completed')

function handleMarkComplete() {
  if (currentModule.value) {
    markModuleCompleted(currentModule.value.id)
  }
}

function navigateToModule(id: string) {
  router.push(`/learn/course/${id}`)
}

// Parse markdown to HTML with code highlighting and mermaid diagram extraction
interface ParsedContent {
  html: string
  mermaidDiagrams: Array<{ id: string, code: string }>
}

function parseMarkdown(content: string): ParsedContent {
  const mermaidDiagrams: Array<{ id: string, code: string }> = []
  let diagramIndex = 0

  // Extract mermaid diagrams and replace with placeholders
  // Handle optional trailing whitespace and CRLF line endings
  let processedContent = content.replace(/``` *mermaid[ \t]*\r?\n([\s\S]*?)```/g, (_, code) => {
    const id = `mermaid-${diagramIndex++}`
    mermaidDiagrams.push({ id, code: code.trim() })
    return `<div data-mermaid-id="${id}"></div>`
  })

  // Simple markdown parsing
  // Headers
  processedContent = processedContent.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
  processedContent = processedContent.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">$1</h2>')
  processedContent = processedContent.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-6">$1</h1>')

  // Horizontal rules
  processedContent = processedContent.replace(/^---$/gm, '<hr class="my-8 border-gray-200 dark:border-gray-700" />')

  // Bold and italic
  processedContent = processedContent.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  processedContent = processedContent.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Code blocks (non-mermaid) - MUST run before inline code to prevent backtick conflicts
  // Handle various whitespace patterns: optional space after backticks, optional trailing whitespace after language, CRLF or LF
  processedContent = processedContent.replace(/``` *(\w+)?[ \t]*\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || 'text'
    return `<pre class="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto my-4"><code class="language-${language} text-sm">${escapeHtml(code.trim())}</code></pre>`
  })

  // Inline code - runs after code blocks
  processedContent = processedContent.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">$1</code>')

  // Tables
  processedContent = processedContent.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').filter(c => c.trim())
    if (cells.every(c => c.trim().match(/^[-:]+$/))) {
      return '<tr class="table-separator"></tr>'
    }
    const isHeader = match.includes('---')
    const cellTag = isHeader ? 'th' : 'td'
    const cellClass = isHeader
      ? 'px-4 py-2 text-left font-semibold bg-gray-50 dark:bg-gray-800'
      : 'px-4 py-2 border-t border-gray-200 dark:border-gray-700'
    return `<tr>${cells.map(c => `<${cellTag} class="${cellClass}">${c.trim()}</${cellTag}>`).join('')}</tr>`
  })

  // Wrap tables
  processedContent = processedContent.replace(
    /(<tr[^>]*>[\s\S]*?<\/tr>[\s\n]*)+/g,
    (match) => {
      // Remove separator rows and wrap in table
      const cleanedMatch = match.replace(/<tr class="table-separator"><\/tr>/g, '')
      if (cleanedMatch.trim()) {
        return `<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">${cleanedMatch}</table></div>`
      }
      return ''
    },
  )

  // Lists
  processedContent = processedContent.replace(/^(\d+)\. (.*)$/gm, '<li class="ml-6 list-decimal mb-1">$2</li>')
  processedContent = processedContent.replace(/^- (.*)$/gm, '<li class="ml-6 list-disc mb-1">$1</li>')

  // Wrap consecutive list items
  processedContent = processedContent.replace(
    /(<li class="ml-6 list-disc[^>]*>[\s\S]*?<\/li>[\s\n]*)+/g,
    (match) => `<ul class="my-3">${match}</ul>`,
  )
  processedContent = processedContent.replace(
    /(<li class="ml-6 list-decimal[^>]*>[\s\S]*?<\/li>[\s\n]*)+/g,
    (match) => `<ol class="my-3">${match}</ol>`,
  )

  // Links
  processedContent = processedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary hover:underline">$1</a>',
  )

  // Details/Summary (checkpoint questions)
  processedContent = processedContent.replace(
    /<details>\s*<summary>(.*?)<\/summary>\s*([\s\S]*?)<\/details>/g,
    `<details class="my-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <summary class="cursor-pointer font-medium text-primary hover:text-primary/80">$1</summary>
      <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">$2</div>
    </details>`,
  )

  // Paragraphs - wrap remaining text blocks
  const lines = processedContent.split('\n')
  const result: string[] = []
  let inParagraph = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      result.push('')
    }
    else if (trimmed.startsWith('<') || trimmed.startsWith('[data-mermaid-id')) {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      result.push(line)
    }
    else {
      if (!inParagraph) {
        result.push('<p class="my-3 leading-relaxed">')
        inParagraph = true
      }
      result.push(line)
    }
  }
  if (inParagraph) {
    result.push('</p>')
  }

  return {
    html: result.join('\n'),
    mermaidDiagrams,
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const parsedContent = computed(() => {
  if (!moduleData.value?.content) return null
  return parseMarkdown(moduleData.value.content)
})

// Set page title based on module
useHead({
  title: computed(() => currentModule.value ? `${currentModule.value.title} - CPQ Course` : 'CPQ Course'),
})
</script>

<template>
  <div v-if="currentModule" class="space-y-4">
    <!-- Navigation Header -->
    <div class="flex items-center justify-between">
      <UButton variant="ghost" icon="i-heroicons-arrow-left" to="/learn/course">
        Back to Course
      </UButton>
      <div class="flex items-center gap-2">
        <UBadge v-if="isCompleted" color="success" variant="subtle">
          <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mr-1" />
          Completed
        </UBadge>
        <UButton
          v-else
          color="primary"
          variant="soft"
          icon="i-heroicons-check"
          @click="handleMarkComplete"
        >
          Mark as Complete
        </UButton>
      </div>
    </div>

    <!-- Module Header -->
    <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm font-mono text-gray-500">Module {{ currentModule.number }}</span>
        <UBadge variant="subtle" size="xs">
          {{ currentModule.level }}
        </UBadge>
      </div>
      <h1 class="text-2xl font-bold">{{ currentModule.title }}</h1>
      <p class="text-gray-500 dark:text-gray-400">{{ currentModule.focus }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
      Failed to load module content. Please try again.
    </div>

    <!-- Content -->
    <div v-else-if="parsedContent" class="prose dark:prose-invert max-w-none">
      <!-- Render parsed HTML -->
      <div v-html="parsedContent.html" />

      <!-- Render Mermaid diagrams -->
      <template v-for="diagram in parsedContent.mermaidDiagrams" :key="diagram.id">
        <ClientOnly>
          <LearnMermaidDiagram :id="diagram.id" :chart="diagram.code" />
        </ClientOnly>
      </template>
    </div>

    <!-- Navigation Footer -->
    <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
      <UButton
        v-if="previousModule"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="navigateToModule(previousModule.id)"
      >
        {{ previousModule.title }}
      </UButton>
      <div v-else />

      <UButton
        v-if="nextModule"
        variant="ghost"
        trailing-icon="i-heroicons-arrow-right"
        @click="navigateToModule(nextModule.id)"
      >
        {{ nextModule.title }}
      </UButton>
    </div>
  </div>

  <!-- Module not found -->
  <div v-else class="text-center py-12">
    <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h2 class="text-xl font-semibold mb-2">Module Not Found</h2>
    <p class="text-gray-500 mb-4">The requested course module could not be found.</p>
    <UButton to="/learn/course">
      Back to Course
    </UButton>
  </div>
</template>
