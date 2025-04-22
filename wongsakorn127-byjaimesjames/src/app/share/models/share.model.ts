export interface Selector {
    sequence: number;
    text: string;
    selectorId: string;

}

export interface Identify {
    username: string;
    email: string;
}

export interface Info extends Identify{
    profileUrl: string | null;
}