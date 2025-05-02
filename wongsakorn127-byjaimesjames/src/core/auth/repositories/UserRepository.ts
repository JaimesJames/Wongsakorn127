import { AuthUser } from "../entities/AuthUser";
import { User } from "../entities/User";

export interface UserPort {
    createUserIfNotExists(user: AuthUser): Promise<void>
    getUserInfomation(): Promise<User|null>
}