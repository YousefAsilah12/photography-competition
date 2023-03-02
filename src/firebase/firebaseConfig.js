// Import the functions you need from the SDKs you need

import {initializeApp} from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getStorage}from "firebase/storage"


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
const db = getFirestore(app);
const storage=getStorage(app);

export { app , db ,storage};
