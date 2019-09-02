export default ({ app }) => {
   app.router.afterEach((to, from) => {
     if (process.env.NODE_ENV === 'production' && window.location.protocol != 'https:') {
       window.location.protocol = 'https:'
     }
   })
}
