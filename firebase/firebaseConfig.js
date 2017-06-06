import * as firebase from 'firebase';

const firebaseConfig = {
      apiKey: process.env.FIREBASE_KEY,
      authDomain: "spin-or-starve-ae571.firebaseapp.com",
      databaseURL: "https://spin-or-starve-ae571.firebaseio.com",
      projectId: "spin-or-starve-ae571",
      storageBucket: "spin-or-starve-ae571.appspot.com",
      messagingSenderId: "764003019503"
}

export default firebaseConfig;
