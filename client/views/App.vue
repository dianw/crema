<template>
  <v-app standalone>
    <v-navigation-drawer v-model="showDrawer" persistent absolute overflow enable-resize-watcher>
      <v-toolbar dark class="blue darken-4">
        <v-toolbar-title>Crema</v-toolbar-title>
      </v-toolbar>
      <v-list dense>
        <template v-for="menu in menus">
          <v-list-tile v-if="!menu.sub" :value="routeMatched(menu.to.name)" :key="menu.text" :to="menu.to">
            <v-list-tile-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ menu.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group v-if="menu.sub" :value="routeMatched(menu.to.name)" :key="menu.text">
            <v-list-tile slot="item">
              <v-list-tile-action>
                <v-icon>{{ menu.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ menu.text }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_down</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile v-for="sub in menu.sub" :key="sub.text" :to="sub.to">
              <v-list-tile-content>
                <v-list-tile-title>{{ sub.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="blue darken-4">
      <v-toolbar-side-icon @click.native.stop="showDrawer = !showDrawer" fixed></v-toolbar-side-icon>
      <v-toolbar-title v-if="!showDrawer">Crema</v-toolbar-title>
    </v-toolbar>
    <main class="ma-1">
      <v-card>
        <v-card-text>
          <router-view></router-view>
        </v-card-text>
      </v-card>
    </main>
    <v-footer class="mt-5">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Sidenav from 'components/Sidenav';

export default {
  components: {
    Sidenav
  },
  data: () => ({
    showDrawer: true,
    footer: {
      fixed: false
    }
  }),
  computed: {
    menus: () => ([
      {
        text: 'Home',
        icon: 'home',
        to: {
          name: 'home'
        }
      },
      {
        text: 'Hash',
        icon: 'vpn_key',
        to: {
          name: 'hash'
        },
        sub: [
          {
            text: 'MD5',
            to: {
              name: 'hash',
              params: {
                alg: 'md5'
              }
            }
          },
          {
            text: 'SHA-1',
            to: {
              name: 'hash',
              params: {
                alg: 'sha1'
              }
            }
          },
          {
            text: 'SHA-256',
            to: {
              name: 'hash',
              params: {
                alg: 'sha256'
              }
            }
          },
          {
            text: 'SHA-512',
            to: {
              name: 'hash',
              params: {
                alg: 'sha512'
              }
            }
          }
        ]
      },
      {
        text: 'Public-Key Infrastructure',
        icon: 'fingerprint',
        to: {
          name: 'pki'
        },
        sub: [
          {
            text: 'RSA Key-Pair',
            to: {
              name: 'key-pair-gen'
            }
          },
          {
            text: 'Certificate Signing Request'
          }
        ]
      }
    ])
  },
  methods: {
    routeMatched(routeName) {
      return this.$route.matched
          .reduce((m, v) => v.name === routeName || m, false);
    }
  }
}
</script>

<style>
</style>
