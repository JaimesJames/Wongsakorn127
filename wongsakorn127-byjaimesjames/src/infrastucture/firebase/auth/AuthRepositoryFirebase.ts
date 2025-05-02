import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, User } from "firebase/auth";
import { AuthUser } from "../../../core/auth/entities/AuthUser";
import { AuthPort } from "../../../core/auth/repositories/AuthRepository";

export class AuthRepositoryFirebase implements AuthPort {
    async logOut(): Promise<void> {
        const auth = getAuth()
        return await signOut(auth)
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        try {
            const auth = getAuth()
            const user = await new Promise<User | null>((resolve) => {
                const unsubscribe = auth.onAuthStateChanged((user) => {
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
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during get WSK account';
            const errorCode = error.code ?? 'unknown';
            console.error(`get WSK account Error [${errorCode}]: ${errorMessage}`);
            throw new Error(`get WSK account failed: [${errorCode}] ${errorMessage}`);
        }
    }
    async registerWithWSKAccount(username: string, email: string, password: string): Promise<AuthUser> {
        try {
            const auth = getAuth()
            const result = await createUserWithEmailAndPassword(auth, email, password)

            const user = result.user
            return {
                uid: user.uid,
                displayName: username ?? '',
                email: user.email ?? '',
                photoURL: user.photoURL ?? ''
            }
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during WSK account register';
            const errorCode = error.code ?? 'unknown';
            console.error(`WSK account register Error [${errorCode}]: ${errorMessage}`);
            throw new Error(`WSK account register failed: [${errorCode}] ${errorMessage}`);
        }
    }
    async loginWithWSKAccount(email: string, password: string): Promise<AuthUser> {
        try {
            const auth = getAuth()
            const result = await signInWithEmailAndPassword(auth, email, password)

            const user = result.user
            return {
                uid: user.uid,
                displayName: user.displayName ?? '',
                email: user.email ?? '',
                photoURL: user.photoURL ?? ''
            }
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during WSK account log-in';
            const errorCode = error.code ?? 'unknown';
            console.error(`WSK account log-in Error [${errorCode}]: ${errorMessage}`);
            throw new Error(`WSK account log-in failed: [${errorCode}] ${errorMessage}`);
        }

    }
    async signInWithGoogle(): Promise<AuthUser> {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const user = result.user
            return {
                uid: user.uid,
                displayName: user.displayName ?? '',
                email: user.email ?? '',
                photoURL: user.photoURL ?? ''
            }
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during Google sign-in';
            const errorCode = error.code ?? 'unknown';
            console.error(`Google Sign-In Error [${errorCode}]: ${errorMessage}`);
            throw new Error(`Google Sign-In failed: [${errorCode}] ${errorMessage}`);
        }

    }
}