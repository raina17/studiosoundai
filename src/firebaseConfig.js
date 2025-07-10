import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // This import is necessary

const firebaseConfig = {
  apiKey: "AIzaSyCUEaqXgPBBMPIH0FNgz1xLvTYdA5EMMlw",
  authDomain: "studio-sound-ai.firebaseapp.com",
  projectId: "studio-sound-ai",
  storageBucket: "studio-sound-ai.firebasestorage.app",
  messagingSenderId: "700933094046",
  appId: "1:700933094046:web:daa133da8b588a9798998f",
  measurementId: "G-VNDSB8RQXN"
};

const app = initializeApp(firebaseConfig);

// This line MUST be here to fix the error
export const auth = getAuth(app);