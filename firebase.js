import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiMi-gMhXatSUQd-HcD8SO2eG4nsATu4Y",
  authDomain: "llm-click-tracker.firebaseapp.com",
  projectId: "llm-click-tracker",
  storageBucket: "llm-click-tracker.appspot.com",
  messagingSenderId: "764668315789",
  appId: "1:764668315789:web:630f387cf74e074a09bac4",
  measurementId: "G-LS1M1KBR8E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
