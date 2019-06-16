<template>
  <div v-show="showBtn" class="pa-3 bottom">
    <v-btn @click.stop="logOut()" flat>
      <span class="mr-2">salir de la app</span>
      <v-icon>exit_to_app</v-icon>
    </v-btn>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'LogOutBtn',
  props: {
    showBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions(['logout']),
    logOut () {
      this.logout().then(route => this.$router.push(route))
    }
  }
}
</script>
