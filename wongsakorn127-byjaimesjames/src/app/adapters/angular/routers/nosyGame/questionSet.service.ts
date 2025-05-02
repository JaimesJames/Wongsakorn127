import { Injectable } from "@angular/core";
import { QuestionSetRepositoryFirebase } from "../../../../../infrastucture/firebase/nosyGame/QuestionSetRepositoryFirebase";
import { CreateQuestionSet } from "../../../../../application/nosyGame/CreateQuestionSet";

@Injectable({ providedIn: 'root' })
export class QuestionSetService {
    private repo = new QuestionSetRepositoryFirebase()

    async create(id: string, name: string) {
        const useCase = new CreateQuestionSet(this.repo)
        return await useCase.execute({ id,name })
    }
}