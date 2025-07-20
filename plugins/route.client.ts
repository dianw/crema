export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach((to, from) => {
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      window.location.protocol = 'https:'
    }
  })
})
