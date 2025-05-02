import { Injectable } from "@angular/core";
import { AuthUser } from "../../../../../core/auth/entities/AuthUser";
import { AuthRepositoryFirebase } from "../../../../../infrastucture/firebase/auth/AuthRepositoryFirebase";
import { loginWithGoogle } from "../../../../../application/auth/loginWithGoogle";
import { UserRepositoryFirestore } from "../../../../../infrastucture/firebase/auth/UserRepositoryFirestore";
import { loginWithWSKAccount } from "../../../../../application/auth/loginWithWSKAccount";
import { registerWithWSKAccount } from "../../../../../application/auth/registerWithWSKAccount";
import { currentUser } from "../../../../../application/auth/currentUser";
import { User } from "../../../../../core/auth/entities/User";
import { UserInfomation } from "../../../../../application/auth/userInfomation";
import { logout } from "../../../../../application/auth/logout";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authRepo = new AuthRepositoryFirebase()
    private userRepo = new UserRepositoryFirestore(this.authRepo)
    
    async loginWithGoogle(): Promise<AuthUser> {
        const useCase = new loginWithGoogle(this.authRepo, this.userRepo)
        return await useCase.execute()
    }

    async loginWithWSKAccount(email: string, password: string): Promise<AuthUser> {
        const useCase = new loginWithWSKAccount(this.authRepo, this.userRepo)
        return await useCase.execute({email, password})
    }

    async registerWithWSKAccount(username:string, email:string, password:string): Promise<AuthUser>{
        const useCase = new registerWithWSKAccount(this.authRepo, this.userRepo)
        return await useCase.execute({username, email, password})
    }

    async getCurrentUser():Promise<AuthUser|null>{
        const useCase = new currentUser(this.authRepo)
        return await useCase.execute()
    }

    async getUserInfomation(): Promise<User|null> {
        const useCase = new UserInfomation(this.userRepo)
        return await useCase.execute()
    }

    async logout() {
        const useCase = new logout(this.authRepo)
        return await useCase.execute() 
    }
}