import { Injectable } from "@angular/core";
import { AuthUser } from "../../../../../core/auth/entities/AuthUser";
import { loginWithGoogle } from "../../../../../application/auth/loginWithGoogle";
import { loginWithWSKAccount } from "../../../../../application/auth/loginWithWSKAccount";
import { registerWithWSKAccount } from "../../../../../application/auth/registerWithWSKAccount";
import { currentUser } from "../../../../../application/auth/currentUser";
import { User } from "../../../../../core/auth/entities/User";
import { UserInfomation } from "../../../../../application/auth/userInfomation";
import { logout } from "../../../../../application/auth/logout";
import { AuthPort } from "../../../../../core/auth/repositories/AuthRepository";
import { UserPort } from "../../../../../core/auth/repositories/UserRepository";

interface AuthRepositories {
    authRepo: AuthPort;
    userRepo: UserPort;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private repositoriesPromise?: Promise<AuthRepositories>;

    private getRepositories(): Promise<AuthRepositories> {
        this.repositoriesPromise ??= Promise.all([
            import("../../../../../infrastructure/firebase/auth/AuthRepositoryFirebase"),
            import("../../../../../infrastructure/firebase/auth/UserRepositoryFirestore"),
        ]).then(([authModule, userModule]) => {
            const authRepo = new authModule.AuthRepositoryFirebase();
            const userRepo = new userModule.UserRepositoryFirestore(authRepo);
            return { authRepo, userRepo };
        });

        return this.repositoriesPromise;
    }
    
    async loginWithGoogle(): Promise<AuthUser> {
        const { authRepo, userRepo } = await this.getRepositories();
        const useCase = new loginWithGoogle(authRepo, userRepo)
        return await useCase.execute()
    }

    async loginWithWSKAccount(email: string, password: string): Promise<AuthUser> {
        const { authRepo, userRepo } = await this.getRepositories();
        const useCase = new loginWithWSKAccount(authRepo, userRepo)
        return await useCase.execute({email, password})
    }

    async registerWithWSKAccount(username:string, email:string, password:string): Promise<AuthUser>{
        const { authRepo, userRepo } = await this.getRepositories();
        const useCase = new registerWithWSKAccount(authRepo, userRepo)
        return await useCase.execute({username, email, password})
    }

    async getCurrentUser():Promise<AuthUser|null>{
        const { authRepo } = await this.getRepositories();
        const useCase = new currentUser(authRepo)
        return await useCase.execute()
    }

    async getUserInfomation(): Promise<User|null> {
        const { userRepo } = await this.getRepositories();
        const useCase = new UserInfomation(userRepo)
        return await useCase.execute()
    }

    async logout() {
        const { authRepo } = await this.getRepositories();
        const useCase = new logout(authRepo)
        return await useCase.execute() 
    }
}
