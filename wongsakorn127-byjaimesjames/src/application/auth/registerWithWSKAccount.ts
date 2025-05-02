import { AuthPort } from "../../core/auth/repositories/AuthRepository";
import { UserPort } from "../../core/auth/repositories/UserRepository";

export class registerWithWSKAccount {
    constructor(
        private readonly authPort: AuthPort,
        private readonly userPort: UserPort
    ) { }

    async execute(input: { username: string, email: string, password: string }) {
        const user = await this.authPort.registerWithWSKAccount(input.username, input.email, input.password);
        if (user) {
            await this.userPort.createUserIfNotExists(user)
        }
        return user
    }
}