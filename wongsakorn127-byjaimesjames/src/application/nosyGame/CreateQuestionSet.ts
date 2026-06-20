import { QuestionDetail } from "../../core/nosyGame/entities/QuestionDetail";
import { QuestionSetRepository } from "../../core/nosyGame/repositories/QuestionSetRepository";

export class CreateQuestionSet {
    constructor(
        private readonly repo: QuestionSetRepository
    ) { }

    async execute(input: {setName: string, questions: QuestionDetail[]}): Promise<void>{
        return await this.repo.createQuestionSet(input.setName, input.questions)
    }
}
