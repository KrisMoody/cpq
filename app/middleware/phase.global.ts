import { navMappings } from '~/config/phases'

/**
 * Paths that should never be blocked by phase restrictions
 */
const EXEMPT_PATHS = [
  '/',           // Dashboard
  '/login',
  '/register',
  '/verify-email',
  '/auth',
  '/learn',      // Learning content is always available
  '/roadmap',    // Roadmap page shows all phases
  '/sales',      // Hub pages handle their own filtering
  '/admin'
]

/**
 * Client-side middleware that protects routes based on the selected phase.
 * If a user tries to access a route that requires a higher phase than
 * currently selected, they are redirected to the dashboard.
 */
export default defineNuxtRouteMiddleware((to) => {
  // Skip phase check for exempt paths
  const basePath = '/' + to.path.split('/').filter(Boolean)[0]
  if (EXEMPT_PATHS.some(path => to.path === path || basePath === path)) {
    return
  }

  // Get the phase required for this route
  const mapping = navMappings.find(m => m.path === basePath)
  if (!mapping) {
    // No mapping found - allow access (default to Phase 1 behavior)
    return
  }

  // Get current phase from cookie
  const phaseCookie = useCookie<number>('cpq-phase')
  const currentPhase = phaseCookie.value ?? 5

  // Check if route is accessible in current phase
  if (mapping.phase > currentPhase) {
    // Route requires a higher phase - redirect to dashboard
    const toast = useToast()
    toast.add({
      title: 'Page not available',
      description: `This page requires Phase ${mapping.phase}. You are currently in Phase ${currentPhase}.`,
      color: 'warning',
      icon: 'i-heroicons-exclamation-triangle'
    })

    return navigateTo('/')
  }
})
