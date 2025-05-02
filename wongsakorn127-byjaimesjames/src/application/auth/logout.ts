import { AuthPort } from "../../core/auth/repositories/AuthRepository";

export class logout {
    constructor(
            private readonly authPort: AuthPort
        ) { }
        async execute(){
            return this.authPort.logOut()
        }
}