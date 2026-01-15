<script setup lang="ts">
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import type { UnitOfMeasure } from '~/composables/useUnits'

const props = defineProps<{
  units: UnitOfMeasure[]
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const columnHelper = createColumnHelper<UnitOfMeasure>()

function formatConversion(unit: UnitOfMeasure): string {
  if (!unit.baseUnit) return '—'
  const factor = typeof unit.conversionFactor === 'string'
    ? parseFloat(unit.conversionFactor)
    : unit.conversionFactor
  return `1 = ${factor} ${unit.baseUnit.abbreviation}`
}

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('abbreviation', {
    header: 'Abbreviation',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => formatConversion(row), {
    id: 'conversion',
    header: 'Base Unit Conversion',
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
    return props.units
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

function handleDelete(id: string) {
  if (!confirm('Are you sure you want to deactivate this unit?')) return
  emit('delete', id)
}
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="globalFilter"
      placeholder="Search units..."
      icon="i-heroicons-magnifying-glass"
      class="max-w-sm"
    />

    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
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
        <tbody class="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 whitespace-nowrap text-sm"
            >
              <template v-if="cell.column.id === 'actions'">
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="`/units/${row.original.id}`"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-pencil-square"
                  />
                  <UButton
                    v-if="row.original.isActive"
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="handleDelete(row.original.id)"
                  />
                </div>
              </template>
              <template v-else-if="cell.column.id === 'name'">
                <NuxtLink
                  :to="`/units/${row.original.id}`"
                  class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {{ cell.getValue() }}
                </NuxtLink>
              </template>
              <template v-else-if="cell.column.id === 'abbreviation'">
                <span class="font-mono">{{ cell.getValue() }}</span>
              </template>
              <template v-else-if="cell.column.id === 'isActive'">
                <UBadge :color="row.original.isActive ? 'success' : 'warning'" variant="subtle">
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

    <p v-if="table.getRowModel().rows.length === 0" class="text-center text-gray-500 py-4">
      No units found
    </p>
  </div>
</template>
