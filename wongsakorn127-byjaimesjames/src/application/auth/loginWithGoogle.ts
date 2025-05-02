import { AuthUser } from "../../core/auth/entities/AuthUser";
import { AuthPort } from "../../core/auth/repositories/AuthRepository";
import { UserPort } from "../../core/auth/repositories/UserRepository";


export class loginWithGoogle {
    constructor(
        private readonly authPort: AuthPort,
        private readonly userPort: UserPort
    ) { }
    async execute(): Promise<AuthUser> {
        const user = await this.authPort.signInWithGoogle()
        if (user) {
            await this.userPort.createUserIfNotExists(user)
        }
        return user
    }
}
