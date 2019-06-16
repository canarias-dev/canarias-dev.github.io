import Vue from 'vue'
import Vuex from 'vuex'
import { auth, database } from '@/plugins/firebase'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: null,
      email: null,
      uid: null
    },
    uid: null
  },
  mutations: {
    saveUID (state, uid) {
      state.uid = uid
    },
    saveUSER (state, user) {
      state.user = user
    }
  },
  actions: {
    signManifest ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        let eventKey = database.ref('/firms/private').push().key
        let dateCalc
        let dateObj = new Date()
        let month = dateObj.getMonth() + 1
        let day = dateObj.getDate()
        if (day <= 9) {
          day = `0${day}`
        }
        if (month <= 9) {
          month = `0${month}`
        }
        let year = dateObj.getFullYear()
        dateCalc = `${year}/${month}/${day}`
        let updates = {}
        updates[`firms/private/${eventKey}/name`] = payload.name
        updates[`firms/private/${eventKey}/title`] = payload.title
        updates[`firms/private/${eventKey}/url`] = payload.url
        updates[`firms/private/${eventKey}/date`] = dateCalc
        database
          .ref()
          .update(updates)
          .then(() => {
            let sended = true
            resolve(sended)
          })
      })
    },
    login ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        auth
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then((loged) => {
            commit('saveUSER', {
              name: loged.user.displayName,
              email: loged.user.email,
              uid: loged.user.uid
            })
            commit('saveUID', loged.user.uid)
            resolve('/controlPanel')
          })
          .catch((error) => {
            console.log(error.message)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        auth.signOut().then(() => {
          commit('saveUSER', {
            name: null,
            email: null,
            uid: null
          })
          commit('saveUID', null)
          resolve('/')
        })
      })
    },
    register ({ commit }, registerData) {
      return new Promise((resolve, reject) => {
        auth
          .createUserWithEmailAndPassword(registerData.email, registerData.password)
          .then(loged => {
            commit('saveUSER', {
              name: loged.user.displayName,
              email: loged.user.email,
              uid: loged.user.uid
            })
            commit('saveUID', loged.user.uid)
            resolve('/controlPanel')
          })
          .catch(err => reject(err))
      })
    }
  },
  getters: {
    isAuthenticated (state) {
      return !!state.user.uid && !!state.uid
    }
  },
  plugins: [createPersistedState()]
})
