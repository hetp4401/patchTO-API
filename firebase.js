const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDRiJOlPGJiD2XE9xuoP3IpyyFKQ-tylLQ",
  authDomain: "hackthenorth-86721.firebaseapp.com",
  projectId: "hackthenorth-86721",
  storageBucket: "hackthenorth-86721.appspot.com",
  messagingSenderId: "2925890372",
  appId: "1:2925890372:web:4a4c6aeb6719ba9aa26511",
  measurementId: "G-2Q0XPYVHNE",
};

firebase.initializeApp(firebaseConfig);

exports.auth = firebase.auth;
exports.db = firebase.firestore();
