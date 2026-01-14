import type { Ref, ComputedRef } from 'vue'

/**
 * Composable for tracking form modifications and confirming navigation away from dirty forms.
 * Uses JSON comparison to detect changes between current form values and initial values.
 */
export function useUnsavedChanges<T extends Record<string, any>>(
  formRef: Ref<T>,
  initialValues: Ref<T> | ComputedRef<T>
) {
  const isDirty = computed(() => {
    return JSON.stringify(formRef.value) !== JSON.stringify(initialValues.value)
  })

  /**
   * Confirms navigation away from a dirty form.
   * Returns true if the form is clean or if the user confirms they want to leave.
   * Returns false if the user cancels the confirmation dialog.
   */
  function confirmLeave(): boolean {
    if (!isDirty.value) return true
    return confirm('You have unsaved changes. Are you sure you want to leave?')
  }

  return { isDirty, confirmLeave }
}
