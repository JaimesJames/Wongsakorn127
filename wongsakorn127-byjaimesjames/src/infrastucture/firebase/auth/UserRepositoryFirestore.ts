import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthUser } from "../../../core/auth/entities/AuthUser";
import { UserPort } from "../../../core/auth/repositories/UserRepository";
import { db } from "../firebase";
import { User } from "../../../core/auth/entities/User";
import { AuthRepositoryFirebase } from "./AuthRepositoryFirebase";
import { convertDocToInfo } from "../dto/user.dto";

export class UserRepositoryFirestore implements UserPort {
    constructor(
        private authRepo: AuthRepositoryFirebase,
    ) { }
    async getUserInfomation(): Promise<User|null> {
        const user = await this.authRepo.getCurrentUser()
        if (user) {
            const userRef = doc(db, `users/${user.uid}`)
            const docSnap = await getDoc(userRef)
            return convertDocToInfo(docSnap)
        }
        return null
    }

    async createUserIfNotExists(user: AuthUser): Promise<void> {
        const userRef = doc(db, `users/${user.uid}`)
        const docSnap = await getDoc(userRef)

        if (!docSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                createdAt: new Date(),
            })
        }
    }
}