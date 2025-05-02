import { QuestionDetail } from "./QuestionDetail";

export class QuestionsText extends QuestionDetail {
    constructor(
        public id: string,
        level: number,
        text: string
    ) {
        super(level, text);
    }
}