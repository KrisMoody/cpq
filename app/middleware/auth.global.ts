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

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check for auth pages
  if (AUTH_PAGES.some(page => to.path === page || to.path.startsWith(page + '/'))) {
    return
  }

  const auth = useNeonAuth()

  // If not yet initialized, try to fetch session
  if (!auth.isAuthenticated.value && !auth.loading.value) {
    await auth.initialize()
  }

  // If still not authenticated, redirect to login
  if (!auth.isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
