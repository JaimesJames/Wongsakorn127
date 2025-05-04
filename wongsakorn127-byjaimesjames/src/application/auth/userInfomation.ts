import { User } from "../../core/auth/entities/User";
import { UserPort } from "../../core/auth/repositories/UserRepository";

export class UserInfomation {
    constructor (
        private readonly userPort: UserPort
    ){}
    async execute(): Promise<User|null>{
        return await this.userPort.getUserInfomation()
    }
}