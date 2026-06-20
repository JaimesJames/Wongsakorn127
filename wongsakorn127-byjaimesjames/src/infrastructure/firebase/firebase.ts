import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { environment } from "../../environments/environment";
import { getFirestore } from "firebase/firestore";

export const app = getApps().length
  ? getApp()
  : initializeApp(environment.firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
