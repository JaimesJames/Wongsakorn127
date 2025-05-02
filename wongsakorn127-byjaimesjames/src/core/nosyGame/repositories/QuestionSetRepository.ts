import { QuestionSet } from "../entities/QuestionSet";

export interface QuestionSetRepository {
    getAll(): Promise<QuestionSet[]>
    // getById(id: string): Promise<QuestionSet | null>
    save(set: QuestionSet): Promise<void>
    // delete(id: string): Promise<void>
}