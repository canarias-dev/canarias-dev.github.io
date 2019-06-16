<template>
  <div>
    <v-btn
      flat
      @click="showDialog = true"
    >
      <span class="mr-2">Firmar el manifiesto</span>
      <v-icon>create</v-icon>
    </v-btn>
    <v-dialog
      v-model="showDialog"
      scrollable
      persistent
      :max-width="!fullScreen ? '400px' : 'false'"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-text>
          <v-form v-model="validForm">
            <v-text-field
              v-model.trim="form.name"
              type="text"
              label="Nombre completo"
              hint="Introduce tus nombres y apellidos"
              :rules="nameRules"
            />
            <v-text-field
              v-model.trim="form.title"
              type="text"
              label="Título Profesional"
              hint="Introduce tu titulo profesional"
              :rules="titleRules"
            />
            <v-text-field
              v-model.trim="form.url"
              type="text"
              label="URL de contacto"
              hint="github, blog, sitio personal, etc"
              :rules="urlRules"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showDialog = false" flat>cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="submit()" :loading="loading" :disabled="!validForm">
            <span class="mr-2 black--text">Firmar</span>
            <v-icon>create</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showConfirm"
      top
      :timeout="6000"
      :color="sysMessages.type"
    >
      {{ sysMessages.message }}
    </v-snackbar>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignManifest',
  beforeMount () {
    this.onResize()
  },
  data: () => ({
    loading: false,
    fullScreen: false,
    validForm: false,
    showConfirm: false,
    showDialog: false,
    sysMessages: {
      type: 'warning',
      message: ''
    },
    form: {
      name: '',
      title: '',
      url: ''
    },
    nameRules: [
      v => !!v || 'Este campo es obligatorio',
      v => v.length > 0 || 'No puedes guardar un campo vacio',
      v => v.length < 60 || 'El nombre no puede exceder los 60 caracteres'
    ],
    titleRules: [
      v => !!v || 'Este campo es obligatorio',
      v => v.length > 0 || 'No puedes guardar un campo vacio',
      v => v.length < 60 || 'El titulo no puede exceder los 60 caracteres'
    ],
    urlRules: [
      v => !!v || 'Este campo es obligatorio',
      v => v.length > 0 || 'No puedes guardar un campo vacio',
      v => v.length < 600 || 'El enlace no puede exceder los 600 caracteres'
    ]
  }),
  methods: {
    ...mapActions(['signManifest']),
    submit () {
      this.loading = true
      this.signManifest(this.form)
        .then(() => {
          this.sysMessages.type = 'info'
          this.sysMessages.message = 'Gracias por firmar el manifiesto!'
          this.showDialog = false
          this.showConfirm = true
          this.loading = false
        })
    },
    onResize () {
      window.innerWidth >= 768 ? this.fullScreen = false : this.fullScreen = true
    }
  }
}
</script>
