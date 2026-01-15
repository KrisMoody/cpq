<script setup lang="ts">
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import type { TaxRate } from '~/composables/useTaxRates'

const props = defineProps<{
  taxRates: TaxRate[]
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const { formatRate } = useTaxRates()

const columnHelper = createColumnHelper<TaxRate>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('rate', {
    header: 'Rate',
    cell: (info) => formatRate(info.getValue()),
  }),
  columnHelper.accessor((row) => row.state ? `${row.state}, ${row.country}` : row.country, {
    id: 'jurisdiction',
    header: 'Jurisdiction',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.category?.name ?? 'All products', {
    id: 'category',
    header: 'Category',
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
    return props.taxRates
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
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="globalFilter"
      placeholder="Search tax rates..."
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
                <div class="flex gap-1">
                  <UButton
                    :to="`/tax-rates/${row.original.id}`"
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
                    @click="emit('delete', row.original.id)"
                  />
                </div>
              </template>
              <template v-else-if="cell.column.id === 'name'">
                <NuxtLink
                  :to="`/tax-rates/${row.original.id}`"
                  class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {{ cell.getValue() }}
                </NuxtLink>
              </template>
              <template v-else-if="cell.column.id === 'rate'">
                <span class="font-mono">{{ cell.getValue() }}</span>
              </template>
              <template v-else-if="cell.column.id === 'category'">
                <span :class="row.original.category ? '' : 'text-gray-400'">
                  {{ cell.getValue() }}
                </span>
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
      No tax rates found
    </p>
  </div>
</template>
