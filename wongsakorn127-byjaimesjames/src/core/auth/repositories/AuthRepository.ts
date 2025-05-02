import { AuthUser } from "../entities/AuthUser";

export interface AuthPort {
    getCurrentUser(): Promise<AuthUser|null>
    signInWithGoogle(): Promise<AuthUser>
    loginWithWSKAccount(email:string, password:string): Promise<AuthUser>
    registerWithWSKAccount(username:string , email:string, password:string): Promise<AuthUser>
    logOut(): Promise<void>
}