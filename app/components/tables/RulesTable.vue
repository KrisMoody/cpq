<script setup lang="ts">
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import type { Rule } from '~/composables/useRules'

const props = defineProps<{
  rules: Rule[]
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const columnHelper = createColumnHelper<Rule>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('trigger', {
    header: 'Trigger',
    cell: (info) => info.getValue().replace('ON_', '').replace(/_/g, ' '),
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('isActive', {
    header: 'Status',
    cell: (info) => info.getValue() ? 'Active' : 'Inactive',
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: (info) => info.row.original.id,
  }),
]

const globalFilter = ref('')

const table = useVueTable({
  get data() {
    return props.rules
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get globalFilter() {
      return globalFilter.value
    },
  },
  onGlobalFilterChange: (value) => {
    globalFilter.value = value as string
  },
})

function getTypeColor(type: string) {
  return type === 'CONFIGURATION' ? 'info' : 'warning'
}
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="globalFilter"
      placeholder="Search rules..."
      icon="i-heroicons-magnifying-glass"
      class="max-w-sm"
    />

    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto rounded-lg border border-ga-gray-300">
      <table class="min-w-full divide-y divide-ga-gray-200 table-fixed">
        <thead class="bg-ga-gray-100">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase tracking-wider cursor-pointer select-none"
              :class="[
                header.column.id === 'name' && 'w-[30%]',
                header.column.id === 'type' && 'w-[15%]',
                header.column.id === 'trigger' && 'w-[18%]',
                header.column.id === 'priority' && 'w-[10%]',
                header.column.id === 'isActive' && 'w-[12%]',
                header.column.id === 'actions' && 'w-[15%]',
              ]"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-1">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <UIcon
                  v-if="header.column.getIsSorted() === 'asc'"
                  name="i-heroicons-chevron-up"
                  class="w-4 h-4"
                />
                <UIcon
                  v-else-if="header.column.getIsSorted() === 'desc'"
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-ga-gray-200">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-ga-gray-100"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 text-sm overflow-hidden"
            >
              <template v-if="cell.column.id === 'actions'">
                <div class="flex gap-1">
                  <UButton
                    :to="`/rules/${row.original.id}`"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-pencil-square"
                  />
                  <UButton
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="emit('delete', row.original.id)"
                  />
                </div>
              </template>
              <template v-else-if="cell.column.id === 'name'">
                <NuxtLink
                  :to="`/rules/${row.original.id}`"
                  class="text-ga-navy-600 hover:underline font-medium truncate block"
                  :title="cell.getValue() as string"
                >
                  {{ cell.getValue() }}
                </NuxtLink>
              </template>
              <template v-else-if="cell.column.id === 'type'">
                <UBadge :color="getTypeColor(cell.getValue() as string)" variant="subtle">
                  {{ cell.getValue() }}
                </UBadge>
              </template>
              <template v-else-if="cell.column.id === 'isActive'">
                <UBadge :color="row.original.isActive ? 'success' : 'neutral'" variant="subtle">
                  {{ row.original.isActive ? 'Active' : 'Inactive' }}
                </UBadge>
              </template>
              <template v-else>
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card List -->
    <div class="md:hidden space-y-3">
      <div
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="rounded-lg border border-ga-gray-300 bg-white p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <NuxtLink
              :to="`/rules/${row.original.id}`"
              class="text-ga-navy-600 hover:underline font-medium"
            >
              {{ row.original.name }}
            </NuxtLink>
            <p class="text-sm text-ga-gray-600 mt-0.5">
              {{ row.original.trigger.replace('ON_', '').replace(/_/g, ' ') }}
            </p>
          </div>
          <div class="flex gap-1">
            <UButton
              :to="`/rules/${row.original.id}`"
              variant="ghost"
              size="xs"
              icon="i-heroicons-pencil-square"
            />
            <UButton
              variant="ghost"
              size="xs"
              color="error"
              icon="i-heroicons-trash"
              @click="emit('delete', row.original.id)"
            />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <UBadge :color="getTypeColor(row.original.type)" variant="subtle">
            {{ row.original.type }}
          </UBadge>
          <UBadge :color="row.original.isActive ? 'success' : 'neutral'" variant="subtle">
            {{ row.original.isActive ? 'Active' : 'Inactive' }}
          </UBadge>
        </div>
      </div>
    </div>

    <p v-if="table.getRowModel().rows.length === 0" class="text-center text-ga-gray-600 py-4">
      No rules found
    </p>
  </div>
</template>
