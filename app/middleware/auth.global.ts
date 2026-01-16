/**
 * Auth pages that don't require authentication
 * These are the only routes accessible without being logged in
 */
const AUTH_PAGES = [
  '/login',
  '/register',
  '/verify-email',
  '/auth/callback'
]

export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for auth pages
  if (AUTH_PAGES.some(page => to.path === page || to.path.startsWith(page + '/'))) {
    return
  }

  // Session state is populated by auth.server.ts plugin during SSR
  // and hydrated to client via useState
  const { isAuthenticated } = useNeonSession()

  // If not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
