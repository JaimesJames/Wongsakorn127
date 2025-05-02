import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { User } from "../../../core/auth/entities/User";

export const convertDocToInfo = (doc: DocumentSnapshot<DocumentData>): User => {
    const data = doc.data() as User;
    return {
        uid: doc.id,
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL
    };
};