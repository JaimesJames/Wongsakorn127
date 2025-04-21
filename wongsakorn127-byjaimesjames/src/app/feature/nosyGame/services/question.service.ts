import { inject, Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, setDoc, Timestamp, collectionData, updateDoc, deleteDoc, writeBatch } from '@angular/fire/firestore';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../../../share/services/auth/auth.service';
import { QuestionDetail, QuestionSet, QuestionsText, RequestSet } from '../models/nosygame.model';
import { convertDocToQuestions, convertDocToQuestionSet } from './question.util';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  async getAllQuestionSet(): Promise<QuestionSet[] | null> {
    try {
      const user = await this.authService.getCurrentUser()

      if (!user) {
        const initializerRef = collection(this.firestore, 'initializer/game-nosy-game/question-set');
        const snapshot = await getDocs(initializerRef);
        return snapshot.docs.map(convertDocToQuestionSet);
      }

      const personalSetRef = collection(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set`);
      const snapshot = await getDocs(personalSetRef);
      if (snapshot.empty) {

        await this.addInitializerQuestion([], user.uid)
      }

      const updatedSnapshot = await getDocs(personalSetRef);
      return updatedSnapshot.docs.map(convertDocToQuestionSet);
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong");
    }
  }

  async getQuestions(setId: string): Promise<QuestionsText[]> {
    const user = await this.authService.getCurrentUser()
    if (!user) {
      const defaultRef = collection(this.firestore, `initializer/game-nosy-game/question-set/${setId}/questions`);
      const snapshot = await getDocs(defaultRef);
      return snapshot.docs.map(convertDocToQuestions)
    }
    const userRef = collection(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions`);
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map(convertDocToQuestions)
  }

  async addQuestionsToSet(setId: string, questions: QuestionDetail[]): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser()
      if (!user) throw new Error('Please log in');

      const batch = writeBatch(this.firestore)

      questions.forEach(question => {

        const questionId = uuid();
        const questionRef = doc(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${questionId}`);

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

  async addQuestionSet(setName: string, questions: QuestionDetail[]): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser()
      if (!user) throw new Error('Please log in');
      const questionSetId = uuid();
      const questionSetRef = doc(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${questionSetId}`);

      await setDoc(questionSetRef, {
        name: setName,
        createdAt: new Date()
      });
      await this.addQuestionsToSet(questionSetId, questions)
    } catch (error) {
      throw new Error("Something went wrong");
    }

  }

  async addInitializerQuestion(except: string[], userId: string): Promise<void> {
    try {
      const questionSetRef = collection(this.firestore, 'initializer/game-nosy-game/question-set');
      const snapshot = await getDocs(questionSetRef);

      const promises = snapshot.docs.map(async (docSnap) => {
        if (!except.includes(docSnap.id)) {
          console.log(docSnap.id, "ii")
          const data = docSnap.data()

          const QuestionsRef = collection(this.firestore, `initializer/game-nosy-game/question-set/${docSnap.id}/questions`);
          const snapshot = await getDocs(QuestionsRef);

          const userQuestionSetRef = doc(this.firestore, `users/${userId}/games/game-nosy-game/question-set/${docSnap.id}`)
          await setDoc(userQuestionSetRef, {
            ...data,
            createdFromDefault: true,
            createdAt: new Date()
          });

          const questionPromises = snapshot.docs.map(async (questionSnap) => {
            const questionData = questionSnap.data();
            const userQuestionsRef = collection(this.firestore, `users/${userId}/games/game-nosy-game/question-set/${docSnap.id}/questions`);
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

  async updateQuestions(setId: string, questions: QuestionsText[]) {
    try {
      const user = await this.authService.getCurrentUser()
      if (!user) throw new Error('Please log in');

      const batch = writeBatch(this.firestore)

      questions.forEach((question) => {

        const updateData: any = {
          updatedAt: new Date(),
        };

        if (question.text !== undefined) updateData.text = question.text;
        if (question.level !== undefined) updateData.level = question.level;

        const questionRef = doc(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${question.id}`);

        batch.update(questionRef, updateData);
      })

      await batch.commit();

    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async deleteQuestions(setId: string, questionId: string[]) {
    try {
      const user = await this.authService.getCurrentUser()
      if (!user) throw new Error('Please log in');

      const batch = writeBatch(this.firestore)

      questionId.forEach(id => {
        const questionRef = doc(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${id}`);
        batch.delete(questionRef);
      })

      await batch.commit();

    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async deleteQuestionSet(setId: string) {
    try {
      const user = await this.authService.getCurrentUser()
      if (!user) throw new Error('Please log in');

      const questionsRef = collection(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions`);
      const snapshot = await getDocs(questionsRef);
      const deleteQuestionsPromises = snapshot.docs.map(docSnap => {
        const questionRef = doc(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}/questions/${docSnap.id}`);
        deleteDoc(questionRef);
      })

      await Promise.all(deleteQuestionsPromises)
      const questionSetRef = doc(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}`);
      await deleteDoc(questionSetRef);

    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async reNameQuestionSetName (setId:string, newName:string){
    try {
      const user = await this.authService.getCurrentUser()
      if (!user) throw new Error('Please log in');

      const questionSetRef = doc(this.firestore, `users/${user.uid}/games/game-nosy-game/question-set/${setId}`);
      await setDoc(questionSetRef, {
        name: newName,
        updatedAt: new Date()
      });

    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async submitRequestSet(setId: string, request: RequestSet) {
    try {
      if(request.setName != '') await this.reNameQuestionSetName(setId, request.setName)
      if(request.create.length > 0) await this.addQuestionsToSet(setId, request.create)
      if(request.update.length > 0) await this.updateQuestions(setId, request.update)
      if(request.delete.length > 0) await this.deleteQuestions(setId, request.delete)
    } catch (error) {
      throw new Error("Something went wrong at request");
    }
  }
}
