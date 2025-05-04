import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { QuestionSet } from "../../../core/nosyGame/entities/QuestionSet";
import { QuestionSetRepository } from "../../../core/nosyGame/repositories/QuestionSetRepository";
import { db } from "../firebase";
import { QuestionDetail } from "../../../core/nosyGame/entities/QuestionDetail";
import { QuestionsText } from "../../../core/nosyGame/entities/QuestionsText";
import { AuthRepositoryFirebase } from "../auth/AuthRepositoryFirebase";
import { convertDocToQuestions, convertDocToQuestionSet } from "../dto/user.dto";
import { v4 as uuid } from 'uuid';

export class QuestionSetRepositoryFirebase implements QuestionSetRepository {
    constructor(
        private authRepo: AuthRepositoryFirebase,
    ) { }
    async getAllQuestionSetName(): Promise<QuestionSet[]> {
        const user = await this.authRepo.getCurrentUser()

        if (!user) {
            const initializerRef = collection(db, 'initializer/game-nosy-game/question-set');
            const snapshot = await getDocs(initializerRef);
            return snapshot.docs.map(convertDocToQuestionSet);
        }

        const personalSetRef = collection(db, `users/${user.uid}/games/game-nosy-game/question-set`);
        const snapshot = await getDocs(personalSetRef);
        if (snapshot.empty) {

            await this.addInitializerSet([], user.uid)
        }

        const updatedSnapshot = await getDocs(personalSetRef);
        return updatedSnapshot.docs.map(convertDocToQuestionSet);
    }
    async getQuestionsBySetId(setId: string): Promise<QuestionsText[] | null> {
        const user = await this.authRepo.getCurrentUser()
        if (!user) {
            const defaultRef = collection(db, `initializer/game-nosy-game/question-set/${setId}/questions`);
            const snapshot = await getDocs(defaultRef);
            return snapshot.docs.map(convertDocToQuestions)
        }
        const userRef = collection(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions`);
        const snapshot = await getDocs(userRef);
        return snapshot.docs.map(convertDocToQuestions)
    }
    async addQuestionsToset(setId: string, questions: QuestionDetail[]): Promise<void> {
        try {
            const user = await this.authRepo.getCurrentUser()
            if (!user) throw new Error('Please log in');

            const batch = writeBatch(db)

            questions.forEach(question => {
                const questionId = uuid();
                const questionRef = doc(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${questionId}`);

                batch.set(questionRef, {
                    text: question.text,
                    level: question.level
                });
            })

            await batch.commit();

        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
    async createQuestionSet(setName: string, questions: QuestionDetail[]): Promise<void> {
        try {
            const user = await this.authRepo.getCurrentUser()
            if (!user) throw new Error('Please log in');
            const questionSetId = uuid();
            const questionSetRef = doc(db, `users/${user.uid}/games/game-nosy-game/question-set/${questionSetId}`);

            await setDoc(questionSetRef, {
                name: setName,
                createdAt: new Date()
            });
            await this.addQuestionsToset(questionSetId, questions)
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
    async addInitializerSet(except: string[], userId: string): Promise<void> {
        try {
            const questionSetRef = collection(db, 'initializer/game-nosy-game/question-set');
            const snapshot = await getDocs(questionSetRef);

            const promises = snapshot.docs.map(async (docSnap) => {
                if (!except.includes(docSnap.id)) {
                    console.log(docSnap.id, "ii")
                    const data = docSnap.data()

                    const QuestionsRef = collection(db, `initializer/game-nosy-game/question-set/${docSnap.id}/questions`);
                    const snapshot = await getDocs(QuestionsRef);

                    const userQuestionSetRef = doc(db, `users/${userId}/games/game-nosy-game/question-set/${docSnap.id}`)
                    await setDoc(userQuestionSetRef, {
                        ...data,
                        createdFromDefault: true,
                        createdAt: new Date()
                    });

                    const questionPromises = snapshot.docs.map(async (questionSnap) => {
                        const questionData = questionSnap.data();
                        const userQuestionsRef = collection(db, `users/${userId}/games/game-nosy-game/question-set/${docSnap.id}/questions`);
                        const newUserQuestionsRef = doc(userQuestionsRef);
                        await setDoc(newUserQuestionsRef, {
                            ...questionData,
                            createdFromDefault: true,
                            createdAt: new Date(),
                        });
                    });

                    await Promise.all(questionPromises);

                }
            })
            await Promise.all(promises)

        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
    async updateQuestions(setId: string, questions: QuestionsText[]): Promise<void> {
        try {
            const user = await this.authRepo.getCurrentUser()
            if (!user) throw new Error('Please log in');

            const batch = writeBatch(db)

            questions.forEach((question) => {

                const updateData: any = {
                    updatedAt: new Date(),
                };

                if (question.text !== undefined) updateData.text = question.text;
                if (question.level !== undefined) updateData.level = question.level;

                const questionRef = doc(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${question.id}`);

                batch.update(questionRef, updateData);
            })

            await batch.commit();

        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
    async deleteQuestions(setId: string, questionId: string[]): Promise<void> {
        try {
            const user = await this.authRepo.getCurrentUser()
            if (!user) throw new Error('Please log in');

            const batch = writeBatch(db)

            questionId.forEach(id => {
                const questionRef = doc(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${id}`);
                batch.delete(questionRef);
            })

            await batch.commit();

        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
    async deleteQuestionSet(setId: string): Promise<void> {
        try {
            const user = await this.authRepo.getCurrentUser()
            if (!user) throw new Error('Please log in');

            const questionsRef = collection(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions`);
            const snapshot = await getDocs(questionsRef);
            const deleteQuestionsPromises = snapshot.docs.map(docSnap => {
                const questionRef = doc(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${docSnap.id}`);
                deleteDoc(questionRef);
            })

            await Promise.all(deleteQuestionsPromises)
            const questionSetRef = doc(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}`);
            await deleteDoc(questionSetRef);

        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
    async renameQuestionSet(setId: string, newName: string): Promise<void> {
        try {
            const user = await this.authRepo.getCurrentUser()
            if (!user) throw new Error('Please log in');

            const questionSetRef = doc(db, `users/${user.uid}/games/game-nosy-game/question-set/${setId}`);
            await setDoc(questionSetRef, {
                name: newName,
                updatedAt: new Date()
            });

        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
}