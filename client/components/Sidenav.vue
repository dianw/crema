<template>
  <div>
    <b-card :no-block="true">
      <b-nav slot="header" vertical pills>
        <b-nav-item v-if="!routerLink" v-for="(tab, index) in tabs" :key="tab.title" :active="activeNav === index" @click="linkClick(tab, index)">
          <i :class="tab.icon"></i>
          {{ tab.title }}
        </b-nav-item>
        <b-nav-item v-if="routerLink" v-for="(tab, index) in tabs" :key="tab.title" :active="linkMatch(tab)" :to="tab.to">
          <i :class="tab.icon"></i>
          {{ tab.title }}
        </b-nav-item>
      </b-nav>
    </b-card>
    <br />
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default() { return []; }
    },
    routerLink: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNav: 0
    }
  },
  methods: {
    linkClick(tab, index) {
      this.activeNav = index;
      this.$emit('link-click', tab, index);
    },
    linkMatch(tab) {
      if (!this.routerLink) {
        return false;
      }
      const matched = this.$route.matched;
      for (let m in matched) {
        m = matched[m];
        if (tab.to.name === m.name) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    this.tabs.forEach((t, i) => {
      if (t.active) {
        this.activeNav = i;
      }
    });
  }
}
</script>
