export interface CardValue {
    type: string;
    value: string;
}

export interface CardInfo extends CardValue {
    symbolId: number;
    ruleId: string;
}

export interface rule {
    ruleId: string;
    text: string;
}