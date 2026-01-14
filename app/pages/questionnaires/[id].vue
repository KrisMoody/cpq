<script setup lang="ts">
import type { QuestionType } from '~/generated/prisma/client.js'

const _route = useRoute()
const router = useRouter()
const toast = useToast()
const {
  fetchQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addProductMapping,
  deleteProductMapping,
  error,
} = useQuestionnaires()
const { products, fetchProducts } = useProducts()

type QuestionnaireWithQuestions = Awaited<ReturnType<typeof fetchQuestionnaire>>

const questionnaire = ref<QuestionnaireWithQuestions | null>(null)
const loading = ref(true)
const saving = ref(false)

const form = ref({
  name: '',
  description: '',
  isActive: true,
})

// New question form
const showAddQuestion = ref(false)
const newQuestion = ref({
  text: '',
  type: 'SINGLE_CHOICE' as QuestionType,
  options: [{ label: '', value: '' }],
})
const addingQuestion = ref(false)

// Edit question state
const editingQuestionId = ref<string | null>(null)
const editQuestionForm = ref({
  text: '',
  type: 'SINGLE_CHOICE' as QuestionType,
  options: [] as Array<{ label: string; value: string }>,
})

// Product mapping state
const showAddMapping = ref<string | null>(null)
const newMapping = ref({
  answerValue: undefined as string | undefined,
  productId: undefined as string | undefined,
  score: 10,
})

const questionnaireId = useRequiredParam('id')

onMounted(async () => {
  await Promise.all([loadQuestionnaire(questionnaireId), fetchProducts()])
})

async function loadQuestionnaire(id: string) {
  loading.value = true
  questionnaire.value = await fetchQuestionnaire(id)
  if (questionnaire.value) {
    form.value.name = questionnaire.value.name
    form.value.description = questionnaire.value.description || ''
    form.value.isActive = questionnaire.value.isActive
  }
  loading.value = false
}

const productOptions = computed(() =>
  products.value.map((p) => ({
    label: `${p.name} (${p.sku})`,
    value: p.id,
  }))
)

const questionTypeOptions = [
  { label: 'Single Choice', value: 'SINGLE_CHOICE' },
  { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
  { label: 'Yes/No', value: 'YES_NO' },
]

const sortedQuestions = computed(() => {
  if (!questionnaire.value) return []
  return [...questionnaire.value.questions].sort((a, b) => a.sortOrder - b.sortOrder)
})

function getQuestionOptions(question: NonNullable<QuestionnaireWithQuestions>['questions'][0]) {
  if (question.type === 'YES_NO') {
    return [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ]
  }
  return (question.options as Array<{ label: string; value: string }>) || []
}

async function handleSaveDetails() {
  if (!questionnaire.value) return
  saving.value = true
  try {
    const updated = await updateQuestionnaire(questionnaire.value.id, {
      name: form.value.name,
      description: form.value.description || undefined,
      isActive: form.value.isActive,
    })
    if (updated) {
      toast.add({ title: 'Questionnaire updated', color: 'success' })
    }
  } finally {
    saving.value = false
  }
}

async function handleAddQuestion() {
  if (!questionnaire.value || !newQuestion.value.text) return
  addingQuestion.value = true
  try {
    const options =
      newQuestion.value.type === 'YES_NO'
        ? [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]
        : newQuestion.value.options.filter((o) => o.label && o.value)

    await addQuestion(questionnaire.value.id, {
      text: newQuestion.value.text,
      type: newQuestion.value.type,
      options,
      sortOrder: sortedQuestions.value.length,
    })
    await loadQuestionnaire(questionnaire.value.id)
    showAddQuestion.value = false
    newQuestion.value = {
      text: '',
      type: 'SINGLE_CHOICE',
      options: [{ label: '', value: '' }],
    }
    toast.add({ title: 'Question added', color: 'success' })
  } finally {
    addingQuestion.value = false
  }
}

function startEditQuestion(question: NonNullable<QuestionnaireWithQuestions>['questions'][0]) {
  editingQuestionId.value = question.id
  editQuestionForm.value = {
    text: question.text,
    type: question.type,
    options:
      question.type === 'YES_NO'
        ? []
        : [...((question.options as Array<{ label: string; value: string }>) || [])],
  }
}

async function handleSaveQuestion() {
  if (!questionnaire.value || !editingQuestionId.value) return
  try {
    const options =
      editQuestionForm.value.type === 'YES_NO'
        ? [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]
        : editQuestionForm.value.options.filter((o) => o.label && o.value)

    await updateQuestion(questionnaire.value.id, editingQuestionId.value, {
      text: editQuestionForm.value.text,
      type: editQuestionForm.value.type,
      options,
    })
    await loadQuestionnaire(questionnaire.value.id)
    editingQuestionId.value = null
    toast.add({ title: 'Question updated', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to update question', color: 'error' })
  }
}

async function handleDeleteQuestion(questionId: string) {
  if (!questionnaire.value) return
  if (!confirm('Delete this question?')) return
  const success = await deleteQuestion(questionnaire.value.id, questionId)
  if (success) {
    await loadQuestionnaire(questionnaire.value.id)
    toast.add({ title: 'Question deleted', color: 'success' })
  }
}

async function handleAddMapping(questionId: string) {
  if (!questionnaire.value || !newMapping.value.productId || !newMapping.value.answerValue) return
  try {
    await addProductMapping(questionnaire.value.id, questionId, {
      productId: newMapping.value.productId,
      answerValue: newMapping.value.answerValue,
      score: newMapping.value.score,
    })
    await loadQuestionnaire(questionnaire.value.id)
    showAddMapping.value = null
    newMapping.value = { answerValue: undefined, productId: undefined, score: 10 }
    toast.add({ title: 'Product mapping added', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to add mapping', color: 'error' })
  }
}

async function handleDeleteMapping(questionId: string, mappingId: string) {
  if (!questionnaire.value) return
  const success = await deleteProductMapping(questionnaire.value.id, questionId, mappingId)
  if (success) {
    await loadQuestionnaire(questionnaire.value.id)
    toast.add({ title: 'Mapping removed', color: 'success' })
  }
}

async function handleDelete() {
  if (!questionnaire.value) return
  if (!confirm('Are you sure you want to delete this questionnaire?')) return
  const success = await deleteQuestionnaire(questionnaire.value.id)
  if (success) {
    toast.add({ title: 'Questionnaire deleted', color: 'success' })
    router.push('/questionnaires')
  }
}

function addNewOption() {
  newQuestion.value.options.push({ label: '', value: '' })
}

function removeNewOption(index: number) {
  newQuestion.value.options.splice(index, 1)
}

function addEditOption() {
  editQuestionForm.value.options.push({ label: '', value: '' })
}

function removeEditOption(index: number) {
  editQuestionForm.value.options.splice(index, 1)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <UButton to="/questionnaires" variant="ghost" icon="i-heroicons-arrow-left" />
      <div class="flex-1">
        <h1 class="text-2xl font-bold">Edit Questionnaire</h1>
        <p class="text-gray-500">Configure questions and product mappings</p>
      </div>
      <UButton
        v-if="questionnaire"
        variant="ghost"
        color="error"
        icon="i-heroicons-trash"
        @click="handleDelete"
      >
        Delete
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <UAlert v-else-if="!questionnaire" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Questionnaire not found</template>
    </UAlert>

    <template v-else>
      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
        <template #description>{{ error }}</template>
      </UAlert>

      <!-- Details Card -->
      <UCard>
        <template #header>
          <h2 class="font-semibold">Questionnaire Details</h2>
        </template>

        <form class="space-y-4" @submit.prevent="handleSaveDetails">
          <UFormField label="Name" required>
            <UInput v-model="form.name" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea v-model="form.description" :rows="2" />
          </UFormField>

          <UFormField>
            <UCheckbox v-model="form.isActive" label="Active" />
          </UFormField>

          <div class="flex justify-end">
            <UButton type="submit" :loading="saving">Save Details</UButton>
          </div>
        </form>
      </UCard>

      <!-- Questions Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Questions</h2>
            <UButton
              size="sm"
              variant="soft"
              icon="i-heroicons-plus"
              @click="showAddQuestion = true"
            >
              Add Question
            </UButton>
          </div>
        </template>

        <div v-if="sortedQuestions.length === 0" class="text-center py-8 text-gray-500">
          No questions yet. Add your first question to get started.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(question, qIndex) in sortedQuestions"
            :key="question.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <!-- Question Header -->
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-gray-500">Q{{ qIndex + 1 }}</span>
                  <UBadge variant="subtle" color="neutral" size="xs">
                    {{ question.type.replace('_', ' ') }}
                  </UBadge>
                </div>

                <!-- View Mode -->
                <template v-if="editingQuestionId !== question.id">
                  <p class="font-medium">{{ question.text }}</p>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <UBadge
                      v-for="option in getQuestionOptions(question)"
                      :key="option.value"
                      variant="outline"
                      size="xs"
                    >
                      {{ option.label }}
                    </UBadge>
                  </div>
                </template>

                <!-- Edit Mode -->
                <template v-else>
                  <div class="space-y-3">
                    <UFormField label="Question Text">
                      <UInput v-model="editQuestionForm.text" />
                    </UFormField>

                    <UFormField label="Type">
                      <USelectMenu
                        v-model="editQuestionForm.type"
                        :items="questionTypeOptions"
                        value-key="value"
                      />
                    </UFormField>

                    <div v-if="editQuestionForm.type !== 'YES_NO'" class="space-y-2">
                      <label class="text-sm font-medium">Options</label>
                      <div
                        v-for="(option, oIndex) in editQuestionForm.options"
                        :key="oIndex"
                        class="flex items-center gap-2"
                      >
                        <UInput v-model="option.label" placeholder="Label" class="flex-1" />
                        <UInput v-model="option.value" placeholder="Value" class="flex-1" />
                        <UButton
                          variant="ghost"
                          color="error"
                          size="xs"
                          icon="i-heroicons-x-mark"
                          @click="removeEditOption(oIndex)"
                        />
                      </div>
                      <UButton
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-plus"
                        @click="addEditOption"
                      >
                        Add Option
                      </UButton>
                    </div>

                    <div class="flex gap-2">
                      <UButton size="sm" @click="handleSaveQuestion">Save</UButton>
                      <UButton
                        variant="ghost"
                        size="sm"
                        @click="editingQuestionId = null"
                      >
                        Cancel
                      </UButton>
                    </div>
                  </div>
                </template>
              </div>

              <div v-if="editingQuestionId !== question.id" class="flex items-center gap-1">
                <UButton
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-pencil"
                  @click="startEditQuestion(question)"
                />
                <UButton
                  variant="ghost"
                  size="xs"
                  color="error"
                  icon="i-heroicons-trash"
                  @click="handleDeleteQuestion(question.id)"
                />
              </div>
            </div>

            <!-- Product Mappings -->
            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-500">Product Mappings</span>
                <UButton
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-plus"
                  @click="showAddMapping = question.id"
                >
                  Add
                </UButton>
              </div>

              <div v-if="question.productMappings.length === 0" class="text-sm text-gray-400">
                No product mappings
              </div>

              <div v-else class="space-y-1">
                <div
                  v-for="mapping in question.productMappings"
                  :key="mapping.id"
                  class="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded px-2 py-1"
                >
                  <div>
                    <span class="font-medium">{{ mapping.product.name }}</span>
                    <span class="text-gray-500 mx-2">when</span>
                    <UBadge variant="subtle" size="xs">{{ mapping.answerValue }}</UBadge>
                    <span class="text-gray-500 mx-2">score:</span>
                    <span class="font-medium">{{ mapping.score }}</span>
                  </div>
                  <UButton
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-x-mark"
                    @click="handleDeleteMapping(question.id, mapping.id)"
                  />
                </div>
              </div>

              <!-- Add Mapping Form -->
              <div
                v-if="showAddMapping === question.id"
                class="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3"
              >
                <UFormField label="When answer is">
                  <USelectMenu
                    v-model="newMapping.answerValue"
                    :items="getQuestionOptions(question)"
                    placeholder="Select answer"
                    value-key="value"
                  />
                </UFormField>

                <UFormField label="Recommend product">
                  <USelectMenu
                    v-model="newMapping.productId"
                    :items="productOptions"
                    placeholder="Select product"
                    searchable
                    value-key="value"
                  />
                </UFormField>

                <UFormField label="Score" hint="Higher = more relevant">
                  <UInput v-model.number="newMapping.score" type="number" min="1" />
                </UFormField>

                <div class="flex gap-2">
                  <UButton size="sm" @click="handleAddMapping(question.id)">
                    Add Mapping
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    @click="showAddMapping = null"
                  >
                    Cancel
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Add Question Modal -->
      <UModal v-model:open="showAddQuestion" title="Add Question">
        <template #content>
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">Add Question</h3>
                <UButton
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="showAddQuestion = false"
                />
              </div>
            </template>

            <div class="space-y-4">
              <UFormField label="Question Text" required>
                <UInput
                  v-model="newQuestion.text"
                  placeholder="What are you looking for?"
                />
              </UFormField>

              <UFormField label="Question Type">
                <USelectMenu
                  v-model="newQuestion.type"
                  :items="questionTypeOptions"
                  value-key="value"
                />
              </UFormField>

              <div v-if="newQuestion.type !== 'YES_NO'" class="space-y-2">
                <label class="text-sm font-medium">Options</label>
                <div
                  v-for="(option, index) in newQuestion.options"
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <UInput
                    v-model="option.label"
                    placeholder="Display label"
                    class="flex-1"
                  />
                  <UInput
                    v-model="option.value"
                    placeholder="Value"
                    class="flex-1"
                  />
                  <UButton
                    v-if="newQuestion.options.length > 1"
                    variant="ghost"
                    color="error"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    @click="removeNewOption(index)"
                  />
                </div>
                <UButton
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-plus"
                  @click="addNewOption"
                >
                  Add Option
                </UButton>
              </div>
            </div>

            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton variant="ghost" @click="showAddQuestion = false">
                  Cancel
                </UButton>
                <UButton
                  :loading="addingQuestion"
                  :disabled="!newQuestion.text"
                  @click="handleAddQuestion"
                >
                  Add Question
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </template>
  </div>
</template>
