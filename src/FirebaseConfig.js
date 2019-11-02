import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyAjgWieFYh1TbA5AIJByw0smga0MXckMas",
  authDomain: "project4-d89d8.firebaseapp.com",
  databaseURL: "https://project4-d89d8.firebaseio.com",
  projectId: "project4-d89d8",
  storageBucket: "project4-d89d8.appspot.com",
  messagingSenderId: "1042049556985",
  appId: "1:1042049556985:web:4b2da9d4a264e2e1"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig)