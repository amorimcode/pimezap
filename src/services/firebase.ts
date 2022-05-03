import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDQErp4TrF2JxecD6k7uRgE9PPQe6tE4LE",
  authDomain: "pimezap.firebaseapp.com",
  databaseURL: "https://pimezap-default-rtdb.firebaseio.com",
  projectId: "pimezap",
  storageBucket: "pimezap.appspot.com",
  messagingSenderId: "1035182004291",
  appId: "1:1035182004291:web:3fc221d8ab480725fedcf6"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

export { firebase, auth, database }