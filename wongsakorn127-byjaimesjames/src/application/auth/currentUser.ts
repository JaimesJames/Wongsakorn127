import { AuthUser } from "../../core/auth/entities/AuthUser";
import { AuthPort } from "../../core/auth/repositories/AuthRepository";

export class currentUser {
    constructor (
        private readonly authPort: AuthPort
    ){}
    async execute(): Promise<AuthUser|null>{
        return await this.authPort.getCurrentUser()
    }
}