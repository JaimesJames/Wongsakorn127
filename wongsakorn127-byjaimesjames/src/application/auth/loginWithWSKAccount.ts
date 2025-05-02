import { AuthUser } from "../../core/auth/entities/AuthUser";
import { AuthPort } from "../../core/auth/repositories/AuthRepository";
import { UserPort } from "../../core/auth/repositories/UserRepository";

export class loginWithWSKAccount {
    constructor(
        private readonly authPort: AuthPort,
        private readonly userPort: UserPort
    ) { }
    async execute(input: { email: string; password: string; }): Promise<AuthUser> {
        const user = await this.authPort.loginWithWSKAccount(input.email, input.password)
        if (user) {
            await this.userPort.createUserIfNotExists(user)
        }
        return user
    }
}