<script setup lang="ts">
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import type { Currency } from '~/composables/useCurrencies'

const props = defineProps<{
  currencies: Currency[]
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const columnHelper = createColumnHelper<Currency>()

const columns = [
  columnHelper.accessor('code', {
    header: 'Code',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('symbol', {
    header: 'Symbol',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('currentRate', {
    header: 'Exchange Rate',
    cell: (info) => {
      const currency = info.row.original
      if (currency.isBase) return 'Base'
      return info.getValue()?.toFixed(4) ?? '—'
    },
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
    return props.currencies
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
      placeholder="Search currencies..."
      icon="i-heroicons-magnifying-glass"
      class="max-w-sm"
    />

    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
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
                    :to="`/currencies/${row.original.id}`"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-pencil-square"
                  />
                  <UButton
                    v-if="row.original.isActive && !row.original.isBase"
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="emit('delete', row.original.id)"
                  />
                </div>
              </template>
              <template v-else-if="cell.column.id === 'code'">
                <NuxtLink
                  :to="`/currencies/${row.original.id}`"
                  class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {{ cell.getValue() }}
                </NuxtLink>
              </template>
              <template v-else-if="cell.column.id === 'symbol'">
                <span class="font-mono">{{ cell.getValue() }}</span>
              </template>
              <template v-else-if="cell.column.id === 'currentRate'">
                <template v-if="row.original.isBase">
                  <UBadge color="primary" variant="subtle" size="xs">Base</UBadge>
                </template>
                <span v-else class="font-mono">{{ row.original.currentRate?.toFixed(4) ?? '—' }}</span>
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

    <!-- Mobile Card List -->
    <div class="md:hidden space-y-3">
      <div
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <NuxtLink
              :to="`/currencies/${row.original.id}`"
              class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {{ row.original.code }}
            </NuxtLink>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ row.original.name }} ({{ row.original.symbol }})
            </p>
          </div>
          <div class="flex gap-1">
            <UButton
              :to="`/currencies/${row.original.id}`"
              variant="ghost"
              size="xs"
              icon="i-heroicons-pencil-square"
            />
            <UButton
              v-if="row.original.isActive && !row.original.isBase"
              variant="ghost"
              size="xs"
              color="error"
              icon="i-heroicons-trash"
              @click="emit('delete', row.original.id)"
            />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <UBadge v-if="row.original.isBase" color="primary" variant="subtle">
            Base
          </UBadge>
          <UBadge :color="row.original.isActive ? 'success' : 'warning'" variant="subtle">
            {{ row.original.isActive ? 'Active' : 'Inactive' }}
          </UBadge>
        </div>
      </div>
    </div>

    <p v-if="table.getRowModel().rows.length === 0" class="text-center text-gray-500 py-4">
      No currencies found
    </p>
  </div>
</template>
