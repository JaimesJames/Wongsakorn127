import { QuestionsText } from "./QuestionsText";

export class CurrentValue extends QuestionsText {
    constructor(
        id: string,
        level: number,
        text: string,
        public isEditing: boolean
    ){
        super(id, level, text);
    }
}