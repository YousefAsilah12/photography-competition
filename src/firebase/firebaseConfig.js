// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDcX0-6pHH_KLteRaxOL2YuDBIMX9NvBgw",

  authDomain: "photography-competition-9434e.firebaseapp.com",

  projectId: "photography-competition-9434e",

  storageBucket: "photography-competition-9434e.appspot.com",

  messagingSenderId: "455359436772",

  appId: "1:455359436772:web:0beb7a9e5adedfeaac19f1",

  measurementId: "G-E7V4HEWZX7"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
