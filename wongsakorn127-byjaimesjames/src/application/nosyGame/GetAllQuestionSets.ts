import { QuestionSet } from "../../core/nosyGame/entities/QuestionSet";
import { QuestionSetRepository } from "../../core/nosyGame/repositories/QuestionSetRepository";

export class GetAllQuestionSets {
    constructor(
        private readonly repo: QuestionSetRepository
    ) { }

    async execute(): Promise<QuestionSet[]>{
        return await this.repo.getAll()
    }
}