
export interface QuestionSet {
    id: string;
    name: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}

export interface QuestionDetail {
    level: number;
    text: string;
}

export interface QuestionsText extends QuestionDetail {
    id: string;
}

export interface CurrentValue extends QuestionsText {
    isEditing: boolean
}