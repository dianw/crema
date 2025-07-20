/**
 * Authentication middleware
 * Checks if user is authenticated before accessing protected routes
 */
export default defineNuxtRouteMiddleware((to) => {
  const { currentUser } = useAuthStore()

  // List of routes that require authentication
  const protectedRoutes: string[] = [
    // Add protected route names here if needed
  ]

  // Check if current route requires authentication
  const requiresAuth = protectedRoutes.includes(to.name as string)

  // If route requires auth and user is not logged in, redirect to login
  if (requiresAuth && !currentUser) {
    return navigateTo('/login')
  }
})
