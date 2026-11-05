
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "av-ai-d8835.firebaseapp.com",
  projectId: "av-ai-d8835",
  storageBucket: "av-ai-d8835.firebasestorage.app",
  messagingSenderId: "383703170215",
  appId: "1:383703170215:web:91ec561da71ee29bfb2f82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {auth,provider}