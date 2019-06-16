<template>
  <v-container id="login" fill-height>
    <v-layout row wrap justify-center align-center>
      <v-flex xs10 sm8 md6 lg3 class="pt-4 text-xs-center">
        <v-text-field
          v-model="email"
          aria-autocomplete="email"
          placeholder="Correo"
        />
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'visibility' : 'visibility_off'"
          :type="show1 ? 'text' : 'password'"
          aria-autocomplete="password"
          placeholder="Contraseña"
          @click:append="show1 = !show1"
        />
        <v-btn @click.stop="submit()" color="primary" :loading="coming" block round>
          entrar
        </v-btn>
        <v-snackbar
          v-model="snackbar"
          bottom
          :timeout="6000"
          multi-line
          color="error"
        >
          {{ messageText }}
          <v-btn
            flat
            @click="snackbar = false"
          >
            ok
          </v-btn>
        </v-snackbar>
        <br>
        <p>No te has registrado aún?</p>
        <v-btn to="/register" color="secondary" block flat round>registrarse</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      show1: false,
      email: '',
      password: '',
      messageText: '',
      coming: false,
      snackbar: false
    }
  },
  methods: {
    ...mapActions(['login']),
    submit () {
      this.coming = true
      this.login({
        email: this.email,
        password: this.password
      })
        .then(route => {
          this.coming = false
          this.$router.push(route)
        })
        .catch(err => {
          this.coming = false
          this.messageText = err.message
          this.snackbar = true
        })
    }
  }
}
</script>
