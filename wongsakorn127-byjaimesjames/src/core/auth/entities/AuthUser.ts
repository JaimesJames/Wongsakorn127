export class AuthUser {
    constructor(
        public uid: string,
        public displayName: string,
        public email: string,
        public photoURL: string | null
    ){ }
}