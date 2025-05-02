import { QuestionSet } from "../../../../core/nosyGame/entities/QuestionSet";

export const toDto = (entity: QuestionSet) => ({
  id: entity.id,
  name: entity.name,
  createdAt: entity.createdAt.toISOString(),
})