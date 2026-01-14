<script setup lang="ts">
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import type { Product } from '~/composables/useProducts'

const props = defineProps<{
  products: Product[]
}>()

const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('sku', {
    header: 'SKU',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue() === 'BUNDLE' ? 'Bundle' : 'Standalone',
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
    return props.products
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
      placeholder="Search products..."
      icon="i-heroicons-magnifying-glass"
      class="max-w-sm"
    />

    <UTable>
      <thead>
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="cursor-pointer select-none"
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
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <template v-if="cell.column.id === 'actions'">
              <UButton
                :to="`/products/${cell.getValue()}`"
                variant="ghost"
                size="xs"
                icon="i-heroicons-eye"
              />
            </template>
            <template v-else-if="cell.column.id === 'type'">
              <UBadge
                :color="cell.getValue() === 'Bundle' ? 'primary' : 'neutral'"
                variant="subtle"
              >
                {{ cell.getValue() }}
              </UBadge>
            </template>
            <template v-else-if="cell.column.id === 'isActive'">
              <UBadge
                :color="cell.getValue() === 'Active' ? 'success' : 'neutral'"
                variant="subtle"
              >
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
    </UTable>

    <p v-if="table.getRowModel().rows.length === 0" class="text-center text-gray-500 py-4">
      No products found
    </p>
  </div>
</template>
