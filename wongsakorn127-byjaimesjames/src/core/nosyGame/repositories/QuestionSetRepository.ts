import { QuestionDetail } from "../entities/QuestionDetail";
import { QuestionSet } from "../entities/QuestionSet";
import { QuestionsText } from "../entities/QuestionsText";

export interface QuestionSetRepository {
    getAllQuestionSetName(): Promise<QuestionSet[]>
    getQuestionsBySetId(setId: string): Promise<QuestionsText[] | null>
    addQuestionsToset(setId: string, questions: QuestionDetail[]): Promise<void>
    createQuestionSet(setName: string, questions: QuestionDetail[]): Promise<void>
    addInitializerSet(except: string[], userId: string): Promise<void>
    updateQuestions(setId: string, questions: QuestionsText[]): Promise<void>
    deleteQuestions(setId: string, questionId: string[]): Promise<void>
    deleteQuestionSet(setId: string): Promise<void>
    renameQuestionSet(setId: string, newName: string): Promise<void>
}