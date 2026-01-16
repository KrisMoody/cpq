export interface CourseModule {
  id: string
  number: string
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner-Intermediate' | 'Intermediate-Advanced'
  focus: string
  filename: string
}

export interface ModuleProgress {
  status: 'not_started' | 'in_progress' | 'completed'
  lastAccessedAt?: string
  completedAt?: string
}

interface CourseProgressState {
  moduleProgress: Record<string, ModuleProgress>
}

const STORAGE_KEY = 'cpq-course-progress'

export const modules: CourseModule[] = [
  { id: '00-introduction', number: '00', title: 'Introduction to CPQ', level: 'Beginner', focus: 'Industry context', filename: '00-introduction.md' },
  { id: '01-cpq-foundations', number: '01', title: 'CPQ Foundations', level: 'Beginner', focus: 'Core workflow', filename: '01-cpq-foundations.md' },
  { id: '02-product-catalog', number: '02', title: 'Product Catalog', level: 'Beginner', focus: 'Products & bundles', filename: '02-product-catalog.md' },
  { id: '03-attribute-system', number: '03', title: 'Attribute System', level: 'Beginner-Intermediate', focus: 'Flexible metadata', filename: '03-attribute-system.md' },
  { id: '04-price-books', number: '04', title: 'Price Books', level: 'Intermediate', focus: 'Pricing architecture', filename: '04-price-books.md' },
  { id: '05-customers-contracts', number: '05', title: 'Customers & Contracts', level: 'Intermediate', focus: 'B2B relationships', filename: '05-customers-contracts.md' },
  { id: '06-quote-building', number: '06', title: 'Quote Building', level: 'Intermediate', focus: 'Line items & totals', filename: '06-quote-building.md' },
  { id: '07-discounts', number: '07', title: 'Discounts', level: 'Intermediate-Advanced', focus: 'Promotion engine', filename: '07-discounts.md' },
  { id: '08-rules-engine', number: '08', title: 'Rules Engine', level: 'Advanced', focus: 'Business logic', filename: '08-rules-engine.md' },
  { id: '09-tax-management', number: '09', title: 'Tax Management', level: 'Intermediate', focus: 'Multi-jurisdiction', filename: '09-tax-management.md' },
  { id: '10-multi-currency', number: '10', title: 'Multi-Currency', level: 'Intermediate-Advanced', focus: 'Global pricing', filename: '10-multi-currency.md' },
  { id: '11-guided-selling', number: '11', title: 'Guided Selling', level: 'Advanced', focus: 'Recommendations', filename: '11-guided-selling.md' },
  { id: '12-architecture', number: '12', title: 'Architecture', level: 'Advanced', focus: 'Integration patterns', filename: '12-architecture.md' },
  { id: '13-capstone', number: '13', title: 'Capstone Project', level: 'Advanced', focus: 'Apply all concepts', filename: '13-capstone.md' },
]

export function useCourseProgress() {
  const state = useState<CourseProgressState>('courseProgress', () => ({
    moduleProgress: {},
  }))

  // Load from localStorage on client
  onMounted(() => {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CourseProgressState
          state.value = parsed
        }
        catch {
          // Invalid data, use defaults
        }
      }
    }
  })

  // Save to localStorage when state changes
  function saveProgress() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
    }
  }

  function getModuleProgress(moduleId: string): ModuleProgress {
    return state.value.moduleProgress[moduleId] ?? { status: 'not_started' }
  }

  function markModuleStarted(moduleId: string) {
    if (!state.value.moduleProgress[moduleId] || state.value.moduleProgress[moduleId].status === 'not_started') {
      state.value.moduleProgress[moduleId] = {
        status: 'in_progress',
        lastAccessedAt: new Date().toISOString(),
      }
      saveProgress()
    }
    else {
      // Update last accessed time
      state.value.moduleProgress[moduleId].lastAccessedAt = new Date().toISOString()
      saveProgress()
    }
  }

  function markModuleCompleted(moduleId: string) {
    state.value.moduleProgress[moduleId] = {
      ...state.value.moduleProgress[moduleId],
      status: 'completed',
      completedAt: new Date().toISOString(),
    }
    saveProgress()
  }

  function resetModuleProgress(moduleId: string) {
    state.value.moduleProgress[moduleId] = { status: 'not_started' }
    saveProgress()
  }

  function resetAllProgress() {
    state.value.moduleProgress = {}
    saveProgress()
  }

  const overallProgress = computed(() => {
    const completed = modules.filter(m => getModuleProgress(m.id).status === 'completed').length
    return Math.round((completed / modules.length) * 100)
  })

  return {
    modules,
    state,
    getModuleProgress,
    markModuleStarted,
    markModuleCompleted,
    resetModuleProgress,
    resetAllProgress,
    overallProgress,
  }
}
