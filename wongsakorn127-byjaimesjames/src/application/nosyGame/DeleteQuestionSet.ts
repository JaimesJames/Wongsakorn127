import { QuestionDetail } from "../../core/nosyGame/entities/QuestionDetail";
import { QuestionSetRepository } from "../../core/nosyGame/repositories/QuestionSetRepository";

export class DeleteQuestionSet {
    constructor(
        private readonly repo: QuestionSetRepository
    ) { }

    async execute(input: {setId: string}): Promise<void>{
        return await this.repo.deleteQuestionSet(input.setId)
    }
}