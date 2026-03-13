export default defineNuxtRouteMiddleware(async () => {
	const auth = useAuthStore()
	await auth.fetchMe()

	if (!auth.isLoggedIn) {
		return navigateTo('/auth')
	}
})
