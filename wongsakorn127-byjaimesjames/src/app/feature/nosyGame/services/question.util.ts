import { Timestamp } from 'firebase/firestore';
import { QuestionSet, QuestionsText } from '../models/nosygame.model';

export const convertDocToQuestionSet = (doc: any): QuestionSet => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
    };
};

export const convertDocToQuestions = (doc: any): QuestionsText => {
    const data = doc.data();
    return {
        id: doc.id,
        level: data.level,
        text: data.text
    };
};