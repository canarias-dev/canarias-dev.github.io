<template>
  <v-container fluid pa-0>
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex xs12 style="background-color: #FFDA48" class="text-xs-center">
        <v-img
          :src="require('../assets/canarilogo.png')"
          contain
          height="200"
        >
        </v-img>
        <h1 class="display-2 font-weight-bold mb-3 mt-2 pa-3">
          Canary Islands
          <br>
          Developers Community
        </h1>
        <p class="subheading">YA SOMOS MÁS DE {{ computedTotalFirms }} PERSONAS!</p>
      </v-flex>
      <v-flex
        xs12
        mb-5
      >
        <v-layout justify-center mt-2>
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm8 class="pa-3">
        <h3 class="display-2 mb-4">Nuestro manifiesto</h3>
        <p class="subheading">Somos un grupo de profesionales de las Islas Canarias del sector de la programación con diverso grado de experiencia. Entendemos Canarias como un conjunto, rechazando la hegemonía de una isla sobre las demás.</p>
        <p class="subheading">El grupo se forma desde el sentimiento generalizado de que la comunidad de desarrolladores y desarrolladoras de software de Canarias no está localmente valorada como merece y esto tiene un impacto en la reducción de oportunidades laborales dignas en las islas.</p>
        <p class="subheading">Los profesionales y las profesionales que trabajamos en esta comunidad hemos demostrado en reiteradas ocasiones estar al mismo nivel que nuestros colegas de otras nacionalidades y nuestro trabajo genera uno de los más altos valores competitivos para cualquier empresa.</p>
        <p class="subheading">Generando comunidad, visibilizando mejores oportunidades y fomentando el diálogo entre profesionales podremos cambiar las cosas.</p>
        <p class="subheading">Es por ello que:</p>
        <ul class="mb-4">
          <li
           v-for="(point, index) in criticalPoints"
           :key="index"
           class="subheading"
          >
            {{ point }}
          </li>
        </ul>
        <p class="subheading">Cualquier persona que participe en el ciclo de desarrollo del software es bienvenida a unirse, escuchar y participar. Somos una comunidad inclusiva y respetuosa con todos los géneros, identidades y formas de expresión.</p>
        <h3 class="display-2 mb-4">Libro de Firmas</h3>
        <p class="subheading">Con nuestras firmas declaramos estar de acuerdo con el manifiesto y colaborar en la medida de nuestras posibilidades a hacerlo una realidad.</p>
        <p class="subheading">{{ totalFirms }} personas ya han firmado el manifiesto.</p>
      </v-flex>
      <v-flex xs12 sm8 md6>
        <v-list three-line>
          <v-list-tile avatar v-for="sign in signList" :key="sign.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ sign.name }}</v-list-tile-title>
              <v-list-tile-sub-title><span class="text--primary">{{ sign.date }}</span> &mdash; {{ sign.title }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn fab small target="_blank" :href="sign.url">
                <v-icon>open_in_new</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action v-show="isAuthenticated">
              <v-btn color="error" fab small @click="denyUser(sign)">
                <v-icon>thumb_down</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider/>
        </v-list>
      </v-flex>
      <v-flex xs12 sm8>
        <div class="text-xs-center">
          <sign-manifest />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { database } from '@/plugins/firebase'
import { mapGetters } from 'vuex'
export default {
  components: {
    SignManifest: () => import(/* webpackChunkName: "bottomSignManifest" */ '@/components/SignManifest.vue')
  },
  created () {
    this.loadData()
  },
  beforeDestroy () {
    if (this.signRef) {
      this.signRef.off()
    }
    if (this.totalFirmsRef) {
      this.totalFirmsRef.off()
    }
  },
  data: () => ({
    ecosystem: [
      {
        text: 'github',
        href: 'https://github.com/canarias-dev'
      },
      {
        text: 'slack',
        href: 'https://publicslack.com/slacks/canariasdev/invites/new'
      }
    ],
    criticalPoints: [
      'Rechazamos la precariedad laboral, demandando una remuneración y condiciones justas acordes a nuestra capacidad.',
      'Deseamos dar visibilidad tanto a profesionales como empresas que en la actualidad han roto los moldes y están demostrando que otro modelo es posible.',
      'Luchamos por que ningún colega tenga que irse de Canarias debido a la falta de oportunidades y que los que estén expatriados encuentren vías de volver si lo desean.',
      'No estamos subvencionados por ninguna empresa ni organización para permitir un diálogo abierto entre iguales.',
      'Promovemos la organización de encuentros en toda Canarias para discutir, analizar y proponer soluciones para los problemas del sector.',
      'No nos centramos en plataformas o lenguajes concretos, sino en ofrecer apoyo y consejo a nuestros iguales.',
      'Buscamos la mejora contínua de nuestras habilidades y situación laboral y para ello nos apoyamos en los conocimientos y experiencias pasadas del resto de miembros de la comunidad.'
    ],
    signRef: undefined,
    totalFirmsRef: undefined,
    signList: [],
    totalFirms: 0
  }),
  methods: {
    loadData () {
      this.signList = []
      this.totalFirms = 0
      if (!this.signRef) {
        this.signRef = database.ref(`firms/public`).orderByChild('date')
        this.signRef.on('child_added', (snapshot) => {
          this.signList.push({
            ...snapshot.val(),
            id: snapshot.key
          })
        })
        this.signRef.on('child_changed', (snapshot) => {
          this.signList.map((val, index) => {
            if (val.id === snapshot.key) {
              this.signList.splice(index, 1, {
                ...snapshot.val(),
                id: snapshot.key
              })
            }
          })
        })
        this.signRef.on('child_removed', (snapshot) => {
          this.signList.map((val, index) => {
            if (val.id === snapshot.key) {
              this.signList.splice(index, 1)
            }
          })
        })
      } else {
        this.signRef.off()
      }
      if (!this.totalFirmsRef) {
        this.totalFirmsRef = database.ref(`totalFirms`)
        this.totalFirmsRef.on('value', value => {
          this.totalFirms = value.val()
        })
      } else {
        this.totalFirmsRef.off()
      }
    },
    denyUser (payload) {
      let updates = {}
      updates[`firms/private/${payload.id}/name`] = payload.name
      updates[`firms/private/${payload.id}/title`] = payload.title
      updates[`firms/private/${payload.id}/url`] = payload.url
      updates[`firms/private/${payload.id}/date`] = payload.date
      updates[`firms/public/${payload.id}/name`] = null
      updates[`firms/public/${payload.id}/title`] = null
      updates[`firms/public/${payload.id}/url`] = null
      updates[`firms/public/${payload.id}/date`] = null
      database
        .ref()
        .update(updates)
        .then(() => {
          database.ref('/totalFirms/').transaction(currentFirms => {
            return currentFirms - 1
          })
        })
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    // Esto es solo para mostrar que somos más de X personas
    // creo que poner un numero estimado convencera a más personas
    // le resto el 0.07% porque es el IGIC :)
    computedTotalFirms () {
      return (this.totalFirms - (this.totalFirms * 0.07)).toFixed(0)
    }
  }
}
</script>

<style>

</style>
