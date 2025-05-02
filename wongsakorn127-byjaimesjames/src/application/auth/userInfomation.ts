import { AuthUser } from "../../core/auth/entities/AuthUser";
import { UserPort } from "../../core/auth/repositories/UserRepository";

export class UserInfomation {
    constructor (
        private readonly userPort: UserPort
    ){}
    async execute(): Promise<AuthUser|null>{
        return await this.userPort.getUserInfomation()
    }
}