export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach(() => {
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      window.location.protocol = 'https:'
    }
  })
})
