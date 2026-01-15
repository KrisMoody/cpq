<script setup lang="ts">
const props = defineProps<{
  id: string
  title: string
  icon: string
  defaultOpen?: boolean
}>()

const model = defineModel<boolean>()

const isOpen = computed({
  get: () => model.value ?? props.defaultOpen ?? true,
  set: (val) => {
    model.value = val
  },
})

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <section :id="id" class="scroll-mt-20">
    <UCard :ui="{ root: 'overflow-visible' }">
      <template #header>
        <button
          class="w-full flex items-center justify-between cursor-pointer"
          @click="toggle"
        >
          <div class="flex items-center gap-2">
            <UIcon :name="icon" class="w-5 h-5" />
            <h2 class="text-lg font-semibold">{{ title }}</h2>
          </div>
          <UIcon
            :name="isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 transition-transform duration-200"
          />
        </button>
      </template>

      <div
        class="grid transition-[grid-template-rows] duration-300 ease-out"
        :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        :inert="isOpen ? undefined : true"
      >
        <div :class="isOpen ? 'overflow-visible' : 'overflow-hidden'">
          <slot />
        </div>
      </div>
    </UCard>
  </section>
</template>
