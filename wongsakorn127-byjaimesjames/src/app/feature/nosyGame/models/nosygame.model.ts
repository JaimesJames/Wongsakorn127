export interface Question {
    id: string;
    text: string[];
}

export interface QuestionSet {
    id: string;
    name: string;
    createdFromDefault: boolean;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}

export interface QuestionsText {
    id: string;
    level: number;
    text: string;
}

export interface QuestionSetResponse {
    questionSets: QuestionSet[];
    questionsText: QuestionsText[];
    error: string | null;
}