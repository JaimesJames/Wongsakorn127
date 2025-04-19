import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { QuestionSet } from '../models/nosygame.model';

@Pipe({
    name: 'questionSetPipe'
})

export class QuestionSetPipe implements PipeTransform {
    transform(doc: any): QuestionSet {
        const data = doc.data();
        return {
            id: data.id,
            name: data.name,
            createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
        }
    }
}