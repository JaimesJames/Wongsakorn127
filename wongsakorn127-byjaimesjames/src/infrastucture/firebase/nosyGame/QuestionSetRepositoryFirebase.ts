import { collection, getDocs } from "firebase/firestore";
import { QuestionSet } from "../../../core/nosyGame/entities/QuestionSet";
import { QuestionSetRepository } from "../../../core/nosyGame/repositories/QuestionSetRepository";
import { db } from "../firebase";

export class QuestionSetRepositoryFirebase implements QuestionSetRepository {
    async getAll(): Promise<QuestionSet[]> {
        const snapshot = await getDocs(collection(db, ''))
        return snapshot.docs.map(doc =>
            QuestionSet.fromFirebase({id:doc.id, ...doc.data()} as any)
        )
    }

    async save(set: QuestionSet): Promise<void> {
        const snapshot = await getDocs(collection(db, ''))
    }
}