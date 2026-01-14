<script setup lang="ts">
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import type { Quote } from '~/composables/useQuotes'

const props = defineProps<{
  quotes: Quote[]
}>()

const { formatPrice } = useCurrencies()

const columnHelper = createColumnHelper<Quote>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Quote #',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'customer',
    header: 'Customer',
    cell: (info) => info.row.original.customer?.name || '—',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'total',
    header: 'Total',
    cell: (info) => formatPrice(info.row.original.total, info.row.original.currency),
  }),
  columnHelper.accessor('validTo', {
    header: 'Valid Until',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
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
    return props.quotes
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

function getStatusColor(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'neutral'
    case 'PENDING':
    case 'PENDING_APPROVAL':
      return 'warning'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'error'
    case 'ACCEPTED':
      return 'primary'
    case 'FINALIZED':
      return 'info'
    case 'CANCELLED':
      return 'neutral'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <div class="space-y-4">
    <UInput
      v-model="globalFilter"
      placeholder="Search quotes..."
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
                <UButton
                  :to="`/quotes/${row.original.id}`"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-pencil-square"
                />
              </template>
              <template v-else-if="cell.column.id === 'name'">
                <NuxtLink
                  :to="`/quotes/${row.original.id}`"
                  class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {{ cell.getValue() }}
                </NuxtLink>
              </template>
              <template v-else-if="cell.column.id === 'status'">
                <UBadge :color="getStatusColor(cell.getValue() as string)" variant="subtle">
                  {{ cell.getValue() }}
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
      No quotes found
    </p>
  </div>
</template>
