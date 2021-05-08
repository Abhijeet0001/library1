import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyCgC6jPVAjngcESiB5lN5zUneqzvsjgxA4",
    authDomain: "library-64a20.firebaseapp.com",
    projectId: "library-64a20",
    storageBucket: "library-64a20.appspot.com",
    messagingSenderId: "984387179527",
    appId: "1:984387179527:web:e6b9994c4cd6050a44c6a2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()