import { RequestSet } from "../../core/nosyGame/entities/RequestSet";
import { QuestionSetRepository } from "../../core/nosyGame/repositories/QuestionSetRepository";

export class SubmitRequestSet {
    constructor(
        private readonly repo: QuestionSetRepository
    ) { }

    async execute(input: { setId: string, request: RequestSet }): Promise<void> {
        if (input.request.setName != '') await this.repo.renameQuestionSet(input.setId, input.request.setName)
        if (input.request.createList.length > 0) await this.repo.addQuestionsToset(input.setId, input.request.createList)
        if (input.request.updateList.length > 0) await this.repo.updateQuestions(input.setId, input.request.updateList)
        if (input.request.deleteList.length > 0) await this.repo.deleteQuestions(input.setId, input.request.deleteList)
    }
}