import { Injectable } from "@angular/core";
import { QuestionSetRepositoryFirebase } from "../../../../../infrastucture/firebase/nosyGame/QuestionSetRepositoryFirebase";
import { AuthRepositoryFirebase } from "../../../../../infrastucture/firebase/auth/AuthRepositoryFirebase";
import { GetAllQuestionSets } from "../../../../../application/nosyGame/GetAllQuestionSetName";
import { QuestionSet } from "../../../../../core/nosyGame/entities/QuestionSet";
import { GetQuestionsBySetId } from "../../../../../application/nosyGame/GetQuestionsBySetId";
import { QuestionsText } from "../../../../../core/nosyGame/entities/QuestionsText";
import { AddInitializerSet } from "../../../../../application/nosyGame/AddInitializerSet";
import { createQuestionSet } from "../../../../../application/nosyGame/CreateQuestionSet";
import { QuestionDetail } from "../../../../../core/nosyGame/entities/QuestionDetail";
import { DeleteQuestionSet } from "../../../../../application/nosyGame/DeleteQuestionSet";
import { SubmitRequestSet } from "../../../../../application/nosyGame/SubmitRequestSet";
import { RequestSet } from "../../../../../core/nosyGame/entities/RequestSet";

@Injectable({ providedIn: 'root' })
export class QuestionSetService {
    private authRepo = new AuthRepositoryFirebase()
    private QuestionsRepo = new QuestionSetRepositoryFirebase(this.authRepo)

    async getAllQuestionSetName(): Promise<QuestionSet[]> {
        const useCase = new GetAllQuestionSets(this.QuestionsRepo)
        return await useCase.execute()
    }

    async getQuestionsBySetId(setId:string): Promise<QuestionsText[]|null> {
        const useCase = new GetQuestionsBySetId(this.QuestionsRepo)
        return await useCase.execute({setId})
    }

    async AddInitializerSet(except: string[], userId: string): Promise<void> {
        const useCase = new AddInitializerSet(this.QuestionsRepo)
        return await useCase.execute({except, userId})
    }

    async createQuestionSet(setName: string, questions: QuestionDetail[]): Promise<void> {
        const useCase = new createQuestionSet(this.QuestionsRepo)
        return await useCase.execute({setName, questions})
    }

    async deleteQuestionSet(setId:string): Promise<void> {
        const useCase = new DeleteQuestionSet(this.QuestionsRepo)
        return await useCase.execute({setId})
    }

    async submitRequestSet( setId: string, request: RequestSet): Promise<void> {
        const useCase = new SubmitRequestSet(this.QuestionsRepo)
        return await useCase.execute({setId, request})
    }
}