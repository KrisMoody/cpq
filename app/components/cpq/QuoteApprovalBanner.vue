<script setup lang="ts">
const props = defineProps<{
  quote: {
    id: string
    status: string
    requiresApproval: boolean
    approvedBy?: string | null
    approvedAt?: string | null
  }
  approvalReasons?: string[]
}>()

const emit = defineEmits<{
  'approve': []
  'reject': [reason: string]
  'submit': []
}>()

const showRejectModal = ref(false)
const rejectReason = ref('')
const processing = ref(false)

function handleReject() {
  if (!rejectReason.value.trim()) return
  emit('reject', rejectReason.value)
  showRejectModal.value = false
  rejectReason.value = ''
}

const bannerConfig = computed(() => {
  switch (props.quote.status) {
    case 'DRAFT':
      if (props.quote.requiresApproval) {
        return {
          color: 'warning' as const,
          icon: 'i-heroicons-exclamation-triangle',
          title: 'Approval Required',
          message: 'This quote requires approval before it can be finalized.',
          showSubmit: true,
          submitLabel: 'Submit for Approval',
        }
      }
      return {
        color: 'info' as const,
        icon: 'i-heroicons-document-check',
        title: 'Ready to Submit',
        message: 'This quote is ready to be submitted.',
        showSubmit: true,
        submitLabel: 'Submit Quote',
      }

    case 'PENDING_APPROVAL':
      return {
        color: 'info' as const,
        icon: 'i-heroicons-clock',
        title: 'Pending Approval',
        message: 'This quote is waiting for approval.',
        showApproveReject: true,
      }

    case 'APPROVED':
      return {
        color: 'success' as const,
        icon: 'i-heroicons-check-circle',
        title: 'Approved',
        message: props.quote.approvedBy
          ? `Approved by ${props.quote.approvedBy} on ${new Date(props.quote.approvedAt!).toLocaleDateString()}`
          : 'This quote has been approved.',
      }

    case 'REJECTED':
      return {
        color: 'error' as const,
        icon: 'i-heroicons-x-circle',
        title: 'Rejected',
        message: 'This quote has been rejected and cannot be finalized.',
      }

    default:
      return null
  }
})
</script>

<template>
  <div v-if="bannerConfig">
    <UAlert
      :color="bannerConfig.color"
      :icon="bannerConfig.icon"
    >
      <template #title>{{ bannerConfig.title }}</template>
      <template #description>
        <div class="space-y-2">
          <p>{{ bannerConfig.message }}</p>

          <!-- Approval Reasons -->
          <div v-if="approvalReasons && approvalReasons.length > 0" class="mt-2">
            <p class="text-sm font-medium">Reasons:</p>
            <ul class="list-disc list-inside text-sm mt-1">
              <li v-for="reason in approvalReasons" :key="reason">{{ reason }}</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div v-if="bannerConfig.showSubmit" class="mt-3">
            <UButton
              size="sm"
              :loading="processing"
              icon="i-heroicons-paper-airplane"
              @click="emit('submit')"
            >
              {{ bannerConfig.submitLabel }}
            </UButton>
          </div>

          <div v-if="bannerConfig.showApproveReject" class="flex gap-2 mt-3">
            <UButton
              size="sm"
              color="success"
              :loading="processing"
              icon="i-heroicons-check"
              @click="emit('approve')"
            >
              Approve
            </UButton>
            <UButton
              size="sm"
              color="error"
              variant="soft"
              icon="i-heroicons-x-mark"
              @click="showRejectModal = true"
            >
              Reject
            </UButton>
          </div>
        </div>
      </template>
    </UAlert>

    <!-- Reject Modal -->
    <UModal v-model:open="showRejectModal" title="Reject Quote">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Reject Quote</h3>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="showRejectModal = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-gray-500">
              Please provide a reason for rejecting this quote. This will be visible to the quote creator.
            </p>

            <UFormField label="Rejection Reason" required>
              <UTextarea
                v-model="rejectReason"
                placeholder="Enter the reason for rejection..."
                :rows="3"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" @click="showRejectModal = false">
                Cancel
              </UButton>
              <UButton
                color="error"
                :disabled="!rejectReason.trim()"
                @click="handleReject"
              >
                Reject Quote
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
