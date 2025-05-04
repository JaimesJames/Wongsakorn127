import { QuestionDetail } from "../../core/nosyGame/entities/QuestionDetail";
import { QuestionSetRepository } from "../../core/nosyGame/repositories/QuestionSetRepository";

export class AddInitializerSet {
    constructor(
        private readonly repo: QuestionSetRepository
    ) { }

    async execute(input: {except: string[], userId: string}): Promise<void>{
        return await this.repo.addInitializerSet(input.except, input.userId)
    }
}