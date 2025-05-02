export class QuestionDetail {
    constructor(
        public level: number,
        public text: string
    ) { }

    isValid(): boolean {
        return this.text.trim().length > 0
    }
}