import { Auth, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, User } from "firebase/auth";
import { AuthUser } from "../../../core/auth/entities/AuthUser";
import { AuthPort } from "../../../core/auth/repositories/AuthRepository";

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
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during get WSK account';
            const errorCode = error.code ?? 'unknown';
            throw new Error(`get WSK account failed: [${errorCode}] ${errorMessage}`);
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
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during WSK account register';
            const errorCode = error.code ?? 'unknown';
            throw new Error(`WSK account register failed: [${errorCode}] ${errorMessage}`);
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
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during WSK account log-in';
            const errorCode = error.code ?? 'unknown';
            throw new Error(`WSK account log-in failed: [${errorCode}] ${errorMessage}`);
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
        } catch (error: any) {
            const errorMessage = error.message ?? 'Unknown error occurred during Google sign-in';
            const errorCode = error.code ?? 'unknown';
            throw new Error(`Google Sign-In failed: [${errorCode}] ${errorMessage}`);
        }

    }
}