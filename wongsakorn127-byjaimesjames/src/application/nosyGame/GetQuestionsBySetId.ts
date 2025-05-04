import { QuestionsText } from "../../core/nosyGame/entities/QuestionsText";
import { QuestionSetRepository } from "../../core/nosyGame/repositories/QuestionSetRepository";

export class GetQuestionsBySetId {
    constructor(
        private readonly repo: QuestionSetRepository
    ) { }

    async execute(input: {setId: string}): Promise<QuestionsText[]|null>{
        return await this.repo.getQuestionsBySetId(input.setId)
    }
}