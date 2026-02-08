import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCORJ3Z2_1EMwh0DycuRBRsHri-tqA3gKE",
    authDomain: "hackl-566af.firebaseapp.com",
    projectId: "hackl-566af",
    storageBucket: "hackl-566af.firebasestorage.app",
    messagingSenderId: "23284448937",
    appId: "1:23284448937:web:8092d31e7b0f5902c0f3b8",
    measurementId: "G-JSP0NLT9XN"
};

// Initialize Firebase (prevents re-initializing during hot reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);

// Analytics only works in the browser
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, auth, analytics };