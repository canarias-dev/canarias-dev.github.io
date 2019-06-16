<template>
  <v-container id="login" fill-height>
    <v-layout row wrap justify-center align-center>
      <v-flex xs12 sm8 md6 class="pt-4 text-xs-center">
        <v-list three-line>
          <v-list-tile avatar v-for="sign in signList" :key="sign.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ sign.name }}</v-list-tile-title>
              <v-list-tile-sub-title><span class="text--primary">{{ sign.date }}</span> &mdash; {{ sign.title }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>
                <a :href="sign.url" target="_blank">{{ sign.url }}</a>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn color="info" fab small @click="aproveUser(sign)">
                <v-icon>thumb_up</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn color="error" fab small @click="denyUser(sign)">
                <v-icon>thumb_down</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider/>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { database } from '@/plugins/firebase'
export default {
  name: 'ControlPanel',
  created () {
    this.loadData()
  },
  beforeDestroy () {
    if (this.signRef) {
      this.signRef.off()
    }
  },
  data: () => ({
    signRef: undefined,
    signList: []
  }),
  methods: {
    loadData () {
      this.signList = []
      if (!this.signRef) {
        this.signRef = database.ref(`firms/private`)
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
    },
    aproveUser (payload) {
      let updates = {}
      updates[`firms/public/${payload.id}/name`] = payload.name
      updates[`firms/public/${payload.id}/title`] = payload.title
      updates[`firms/public/${payload.id}/url`] = payload.url
      updates[`firms/public/${payload.id}/date`] = payload.date
      updates[`firms/private/${payload.id}/name`] = null
      updates[`firms/private/${payload.id}/title`] = null
      updates[`firms/private/${payload.id}/url`] = null
      updates[`firms/private/${payload.id}/date`] = null
      database
        .ref()
        .update(updates)
        .then(() => {
          database.ref('/totalFirms/').transaction(currentFirms => {
            return currentFirms + 1
          })
        })
    },
    denyUser (payload) {
      let updates = {}
      updates[`firms/private/${payload.id}/name`] = null
      updates[`firms/private/${payload.id}/title`] = null
      updates[`firms/private/${payload.id}/url`] = null
      updates[`firms/private/${payload.id}/date`] = null
      updates[`firms/public/${payload.id}/name`] = null
      updates[`firms/public/${payload.id}/title`] = null
      updates[`firms/public/${payload.id}/url`] = null
      updates[`firms/public/${payload.id}/date`] = null
      database
        .ref()
        .update(updates)
    }
  }
}
</script>
