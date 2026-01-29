<script setup lang="ts">
const { products, fetchProducts } = useProducts()
const { quotes, loading: quotesLoading, fetchQuotes } = useQuotes()
const { priceBooks, fetchPriceBooks } = usePricing()
const { customers, loading: customersLoading, fetchCustomers } = useCustomers()
const { discounts, fetchDiscounts } = useDiscounts()
const { rules, fetchRules } = useRules()

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchQuotes(),
    fetchPriceBooks(),
    fetchCustomers(),
    fetchDiscounts(),
    fetchRules(),
  ])
})

const stats = computed(() => [
  {
    label: 'Products',
    value: products.value.length,
    icon: 'i-heroicons-cube',
    to: '/products',
  },
  {
    label: 'Active Quotes',
    value: quotes.value.filter((q) => q.status === 'DRAFT').length,
    icon: 'i-heroicons-document-text',
    to: '/quotes',
  },
  {
    label: 'Customers',
    value: customers.value.filter((c) => c.isActive).length,
    icon: 'i-heroicons-users',
    to: '/customers',
  },
  {
    label: 'Discounts',
    value: discounts.value.filter((d) => d.isActive).length,
    icon: 'i-heroicons-tag',
    to: '/discounts',
  },
  {
    label: 'Rules',
    value: rules.value.filter((r) => r.isActive).length,
    icon: 'i-heroicons-cog-6-tooth',
    to: '/rules',
  },
  {
    label: 'Price Books',
    value: priceBooks.value.length,
    icon: 'i-heroicons-book-open',
    to: '/price-books',
  },
])

const recentQuotes = computed(() => quotes.value.slice(0, 5))
const recentCustomers = computed(() => customers.value.slice(0, 5))

const quickActions = [
  {
    icon: 'i-heroicons-cube',
    title: 'Browse Products',
    description: 'Explore the product catalog',
    to: '/products',
    buttonText: 'View Products',
  },
  {
    icon: 'i-heroicons-document-text',
    title: 'Create Quote',
    description: 'Start a new sales quote',
    to: '/quotes/new',
    buttonText: 'New Quote',
  },
  {
    icon: 'i-heroicons-user-plus',
    title: 'Add Customer',
    description: 'Create a new customer',
    to: '/customers/new',
    buttonText: 'New Customer',
  },
  {
    icon: 'i-heroicons-tag',
    title: 'Manage Discounts',
    description: 'Configure pricing discounts',
    to: '/discounts',
    buttonText: 'View Discounts',
  },
  {
    icon: 'i-heroicons-cog-6-tooth',
    title: 'Configure Rules',
    description: 'Set up business rules',
    to: '/rules',
    buttonText: 'View Rules',
  },
  {
    icon: 'i-heroicons-academic-cap',
    title: 'Learn CPQ',
    description: 'Interactive glossary and concepts',
    to: '/learn',
    buttonText: 'Start Learning',
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'warning'
    case 'PENDING_APPROVAL':
      return 'info'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'error'
    case 'ACCEPTED':
      return 'primary'
    case 'FINALIZED':
      return 'success'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">CPQ Dashboard</h1>
      <p class="text-ga-gray-600 mt-1">
        Configure, Price, Quote - Learning Application
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-ga-navy-100 flex items-center justify-center flex-shrink-0"
          >
            <UIcon :name="stat.icon" class="w-5 h-5 text-ga-navy-600" />
          </div>
          <div class="min-w-0">
            <p class="text-xl font-bold">{{ stat.value }}</p>
            <p class="text-xs text-ga-gray-600 truncate">{{ stat.label }}</p>
          </div>
        </div>
        <template v-if="stat.to" #footer>
          <UButton :to="stat.to" variant="ghost" size="xs" trailing-icon="i-heroicons-arrow-right">
            View
          </UButton>
        </template>
      </UCard>
    </div>

    <!-- Recent Activity Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Quotes -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Recent Quotes</h2>
            <UButton to="/quotes/new" size="sm" icon="i-heroicons-plus">
              New Quote
            </UButton>
          </div>
        </template>

        <div v-if="quotesLoading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
        </div>

        <div v-else-if="recentQuotes.length === 0" class="text-center py-8 text-ga-gray-600">
          No quotes yet. Create your first quote to get started.
        </div>

        <div v-else class="divide-y">
          <div
            v-for="quote in recentQuotes"
            :key="quote.id"
            class="py-3 flex items-center justify-between"
          >
            <div class="min-w-0 flex-1">
              <p class="font-medium truncate">{{ quote.name }}</p>
              <p class="text-sm text-ga-gray-600">
                {{ quote.customer?.name || 'No customer' }} · {{ quote._count?.lineItems ?? 0 }} items
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <UBadge :color="getStatusColor(quote.status)" variant="subtle">
                {{ quote.status }}
              </UBadge>
              <UButton
                :to="`/quotes/${quote.id}`"
                variant="ghost"
                size="sm"
                icon="i-heroicons-arrow-right"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Recent Customers -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Recent Customers</h2>
            <UButton to="/customers/new" size="sm" icon="i-heroicons-plus">
              New Customer
            </UButton>
          </div>
        </template>

        <div v-if="customersLoading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
        </div>

        <div v-else-if="recentCustomers.length === 0" class="text-center py-8 text-ga-gray-600">
          No customers yet. Add your first customer to get started.
        </div>

        <div v-else class="divide-y">
          <div
            v-for="customer in recentCustomers"
            :key="customer.id"
            class="py-3 flex items-center justify-between"
          >
            <div class="min-w-0 flex-1">
              <p class="font-medium truncate">{{ customer.name }}</p>
              <p class="text-sm text-ga-gray-600">
                {{ customer.company || 'No company' }} · {{ customer.quoteCount ?? 0 }} quotes
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <UBadge :color="customer.isActive ? 'success' : 'neutral'" variant="subtle">
                {{ customer.isActive ? 'Active' : 'Inactive' }}
              </UBadge>
              <UButton
                :to="`/customers/${customer.id}`"
                variant="ghost"
                size="sm"
                icon="i-heroicons-arrow-right"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- CPQ Flow Diagram -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">CPQ Workflow</h2>
      </template>
      <LearnCPQFlowDiagram />
    </UCard>

    <!-- Quick Actions -->
    <div>
      <h2 class="font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="action in quickActions" :key="action.title">
          <div class="text-center">
            <UIcon :name="action.icon" class="w-8 h-8 text-ga-navy-500 mx-auto mb-2" />
            <h3 class="font-semibold">{{ action.title }}</h3>
            <p class="text-sm text-ga-gray-600 mt-1">{{ action.description }}</p>
            <UButton :to="action.to" class="mt-4" variant="soft">
              {{ action.buttonText }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
