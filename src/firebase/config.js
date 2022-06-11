import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrQk3Bo5R4s5W1V94_jjCYtUAdlqa2udw",
  authDomain: "cooking-nusantara-site.firebaseapp.com",
  projectId: "cooking-nusantara-site",
  storageBucket: "cooking-nusantara-site.appspot.com",
  messagingSenderId: "338208140449",
  appId: "1:338208140449:web:2642c3afc9c832b29094e0"
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init service
const projectFirestore = firebase.firestore()

export { projectFirestore };