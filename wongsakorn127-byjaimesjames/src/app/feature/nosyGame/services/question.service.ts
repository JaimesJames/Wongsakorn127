import { inject, Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc, Timestamp, collectionData } from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';
import { v4 as uuid } from 'uuid';
import { Observable,firstValueFrom } from 'rxjs';

import { AuthService } from '../../../share/services/auth.service';
import { QuestionSet, QuestionsText, QuestionSetResponse } from '../models/nosygame.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  
  async getAllQuestionSet(): Promise<QuestionSet[]> {
    const user = await new Promise<User | null>((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  
    const convertDocToQuestionSet = (doc: any): QuestionSet => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        createdFromDefault: data.createdFromDefault,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
      };
    };

  
    if (!user) {
      const defaultRef = collection(this.firestore, 'initializer/game-nosy-game/question-set');
      const snapshot = await getDocs(defaultRef);
      return snapshot.docs.map(convertDocToQuestionSet);
    }
  
    const userSetRef = collection(this.firestore, `users/${user.uid}/game-nosy-game/`);
    const snapshot = await getDocs(userSetRef);
  
    if (snapshot.empty) {
      const defaultRef = collection(this.firestore, 'initializer/game-nosy-game/question-set');
      const defaultSnapshot = await getDocs(defaultRef);
      const newDocRef = doc(userSetRef);
      const batch = defaultSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        
        return setDoc(newDocRef, {
          ...data,
          createdFromDefault: true,
          createdAt: new Date()
        });
      });
  
      await Promise.all(batch);

      // const QuestionRef = collection(this.firestore, `users/${user.uid}/game-nosy-game/${newDocRef.id}/questions`);
      // const newDocQuestionRef = doc(QuestionRef);

      // const Questionbatch = defaultSnapshot.docs.map(docSnap => {
      //   const data = docSnap.data();
      //   const defaultQuestionRef = collection(this.firestore, `initializer/game-nosy-game/question-set/${docSnap.id}/questions`);
      //   const defaultQuestionSnapshot = getDocs(defaultQuestionRef);
      //   return setDoc(newDocQuestionRef, {
      //   ...data,
      //   createdFromDefault: true,
      //   createdAt: new Date()
      // });
      // });
  
      // await Promise.all(batch);
      
      
      
    }
  
    const updatedSnapshot = await getDocs(userSetRef);
    return updatedSnapshot.docs.map(convertDocToQuestionSet);
  }

  async getQuestions(setId:string): Promise<QuestionsText[]>{
    const user = await new Promise<User | null>((resolve)=>{
      this.auth.onAuthStateChanged(resolve);
    })
    if (!user) {
      const defaultRef = collection(this.firestore, `initializer/game-nosy-game/question-set/${setId}/questions`);
      const snapshot = await getDocs(defaultRef);
      console.log(snapshot.docs.map(qDoc => ({
        id: qDoc.id,
        ...qDoc.data()
      })))
      return snapshot.docs.map(qDoc =>{
        const data = qDoc.data() as QuestionsText
        return{
        id: qDoc.id,
        text: data.text,
        level: data.level
      }
      })
    }
    const defaultRef = collection(this.firestore, `users/${user.uid}/game-nosy-game/question-set/${setId}/questions`);
    return []
  }

  async addQuestionToSet(setName: string, question: string, answer: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('ต้องล็อกอินก่อน');

    const questionId = uuid();  // หรือใช้ addDoc ก็ได้ แต่ setDoc จะใช้ path ตรงนี้

    const questionRef = doc(this.firestore,
      `users/${user.uid}/${setName}/${questionId}`
    );

    await setDoc(questionRef, {
      question,
      answer,
      createdAt: new Date()
    });
  }
}
