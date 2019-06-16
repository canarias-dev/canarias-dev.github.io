<template>
  <v-container id="register" fill-height>
    <v-layout row wrap justify-center align-center>
      <v-flex xs10 sm8 md6 lg3 class="pt-4 text-xs-center">
        <v-text-field
          v-model="email"
          placeholder="Correo"
          aria-autocomplete="email"
        />
        <v-text-field
          v-model="password"
          placeholder="Nueva contraseña"
          aria-autocomplete="password"
          :append-icon="show1 ? 'visibility' : 'visibility_off'"
          :type="show1 ? 'text' : 'password'"
          @click:append="show1 = !show1"
        />
        <v-btn @click.stop="submit()" color="primary" :loading="coming" block round>
          crear cuenta
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
        <p>Ya tienes una cuenta?</p>
        <v-btn to="/login" color="secondary" block flat round>iniciar sesión</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'register',
  data () {
    return {
      show1: false,
      email: '',
      password: '',
      coming: false,
      snackbar: false,
      messageText: ''
    }
  },
  methods: {
    ...mapActions(['register']),
    submit () {
      this.coming = true
      this.register({
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
