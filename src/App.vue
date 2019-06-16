<template>
  <v-app>
    <v-toolbar app color="secondary">
      <v-spacer />
      <log-out-btn :showBtn="isAuthenticated"/>
      <sign-manifest v-show="!isAuthenticated" />
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    SignManifest: () => import(/* webpackChunkName: "navSignManifest" */ '@/components/SignManifest.vue'),
    LogOutBtn: () => import(/* webpackChunkName: "logOutBtn" */ '@/components/LogOutBtn.vue')
  },
  data () {
    return {
      //
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>
