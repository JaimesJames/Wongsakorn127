import { QuestionDetail } from './QuestionDetail'
import { QuestionsText } from './QuestionsText'

export class RequestSet {
    constructor(
        public setName: string,
        public createList: QuestionDetail[],
        public updateList: QuestionsText[],
        public deleteList: string[]
  ) { }

isEmpty(): boolean {
    return (
        this.createList.length === 0 &&
        this.updateList.length === 0 &&
        this.deleteList.length === 0
    )
}
}