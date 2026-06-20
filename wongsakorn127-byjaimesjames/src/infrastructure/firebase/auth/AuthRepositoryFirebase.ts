import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { AuthUser } from "../../../core/auth/entities/AuthUser";
import { AuthPort } from "../../../core/auth/repositories/AuthRepository";
import { toFirebaseAppError } from "../firebaseError";

export class AuthRepositoryFirebase implements AuthPort {
    private auth = getAuth()

    async logOut(): Promise<void> {
        return await signOut(this.auth)
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        try {

            const user = await new Promise<User | null>((resolve) => {
                const unsubscribe = this.auth.onAuthStateChanged((user) => {
                    unsubscribe();
                    resolve(user);
                });
            })

            if (!user) {
                return null
            }

            return {
                uid: user.uid,
                displayName: user.displayName ?? '',
                email: user.email ?? '',
                photoURL: user.photoURL || null
            }
        } catch (error) {
            throw toFirebaseAppError(error, 'Could not get current user');
        }
    }
    async registerWithWSKAccount(username: string, email: string, password: string): Promise<AuthUser> {
        try {

            const result = await createUserWithEmailAndPassword(this.auth, email, password)

            const user = result.user
            return {
                uid: user.uid,
                displayName: username ?? '',
                email: user.email ?? '',
                photoURL: user.photoURL ?? ''
            }
        } catch (error) {
            throw toFirebaseAppError(error, 'Could not register WSK account');
        }
    }
    async loginWithWSKAccount(email: string, password: string): Promise<AuthUser> {
        try {

            const result = await signInWithEmailAndPassword(this.auth, email, password)

            const user = result.user
            return {
                uid: user.uid,
                displayName: user.displayName ?? '',
                email: user.email ?? '',
                photoURL: user.photoURL ?? ''
            }
        } catch (error) {
            throw toFirebaseAppError(error, 'Could not log in with WSK account');
        }

    }
    async signInWithGoogle(): Promise<AuthUser> {
        try {

            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(this.auth, provider)
            
            const user = result.user
            return {
                uid: user.uid,
                displayName: user.displayName ?? '',
                email: user.email ?? '',
                photoURL: user.photoURL ?? ''
            }
        } catch (error) {
            throw toFirebaseAppError(error, 'Could not sign in with Google');
        }

    }
}
