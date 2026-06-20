import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { User } from "../../../core/auth/entities/User";
import { Timestamp } from 'firebase/firestore';
import { QuestionSet } from "../../../core/nosyGame/entities/QuestionSet";
import { QuestionsText } from "../../../core/nosyGame/entities/QuestionsText";

export const convertDocToQuestionSet = (doc: DocumentSnapshot<DocumentData>): QuestionSet => {
    const data = doc.data() as QuestionSet;
    if (!data) throw new Error('Document data not found');
    return new QuestionSet(
        doc.id,
        data.name,
        data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt)
    );
};

export const convertDocToQuestions = (doc: DocumentSnapshot<DocumentData>): QuestionsText => {
    const data = doc.data() as QuestionsText;
    if (!data) throw new Error('Document data not found');
    return new QuestionsText(
        doc.id,
        data.level,
        data.text
    )
};
export const convertDocToInfo = (doc: DocumentSnapshot<DocumentData>): User => {
    const data = doc.data() as User;
    if (!data) throw new Error('Document data not found');
    return new User(
        doc.id,
        data.username,
        data.email,
        data.userProfile
    )

};