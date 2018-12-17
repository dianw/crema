<template>
  <b-card>
    <div v-if="currentUser">
      <h1>
        <i class="fa fa-user"></i>
        {{ currentUser.displayName }}
      </h1>
    </div>
    <div v-else>
      <h1>
        Login with
      </h1>
      <div class="d-flex flex-wrap">
        <div class="p-2">
          <b-button variant="secondary" size="lg" @click="login('Google')">
            <i class="fa fa-google"></i>
            <span>
              Google
            </span>
          </b-button>
        </div>
        <div class="p-2">
          <b-button variant="secondary" size="lg" @click="login('Github')">
            <i class="fa fa-github"></i>
            <span>
              GitHub
            </span>
          </b-button>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
  }),
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
      checkLoggedIn: 'auth/isLoggedIn'
    })
  }
}
</script>
