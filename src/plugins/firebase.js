import firebase from '@firebase/app'
import '@firebase/database'
import '@firebase/auth'

const config = {
  apiKey: 'AIzaSyCze2i52EvkgyBymBrbMYrGUOlNgIOdK-8',
  authDomain: 'canari-dev.firebaseapp.com',
  databaseURL: 'https://canari-dev.firebaseio.com',
  projectId: 'canari-dev',
  storageBucket: 'canari-dev.appspot.com',
  messagingSenderId: '716478263619',
  appId: '1:716478263619:web:65d7f73c79a0bb9c'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const auth = firebase.auth()
const database = firebase.database()

export {
  auth,
  database
}
