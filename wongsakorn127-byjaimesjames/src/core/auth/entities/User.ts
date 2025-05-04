export class User {
    constructor(
        public uid: string,
        public username: string,
        public email: string,
        public userProfile: string | null
    ){ }
}