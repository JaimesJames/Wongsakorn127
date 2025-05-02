import { QuestionSet } from "../../core/nosyGame/entities/QuestionSet";
import { QuestionSetRepository } from "../../core/nosyGame/repositories/QuestionSetRepository";

export class CreateQuestionSet {
  constructor(private readonly repo: QuestionSetRepository) {}

  async execute(input: { id: string; name: string; createdAt?: Date }): Promise<void> {
    const set = new QuestionSet(
      input.id,
      input.name,
      input.createdAt ?? new Date()
    )

    if (set.name.trim().length < 3) {
      throw new Error('ชื่อสั้นเกินไป')
    }

    await this.repo.save(set)
  }
}