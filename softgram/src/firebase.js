import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBZkrGxdQcqP8HjJtOMtGHTrNQaOJH8JAY",
    authDomain: "softgram-react.firebaseapp.com",
    projectId: "softgram-react",
    storageBucket: "softgram-react.appspot.com",
    messagingSenderId: "1081004959500",
    appId: "1:1081004959500:web:dbdcb2e24a0d76c52bcb29",
    measurementId: "G-3LWQQBBE0R"

  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};