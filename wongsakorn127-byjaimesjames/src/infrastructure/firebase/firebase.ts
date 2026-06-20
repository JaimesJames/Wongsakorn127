import { initializeApp } from "firebase/app";
import { environment } from "../../environments/environment";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(environment.firebaseConfig)

export const db = getFirestore(app)