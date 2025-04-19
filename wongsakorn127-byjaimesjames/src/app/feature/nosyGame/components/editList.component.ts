import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { QuestionEditItemComponent } from './questionEditItem.component';
import { CurrentValue, QuestionsText } from '../models/nosygame.model';

@Component({
    selector: 'app-edit-list',
    imports: [CommonModule, QuestionEditItemComponent],
    template: `
    <div class="flex flex-col justify-center items-center gap-4">
        <h2 class="my-4">ffgef</h2>
        <button (click)="addingBtn()" [ngClass]="{'border-[#D966BC] w-35':isAdding, 'border-light-bg w-full':!isAdding }" class="border-2 rounded-4xl flex justify-center p-4 transition-all duration-200">
            <div [ngClass]="{'rotate-45':isAdding}" class="transition-all duration-200">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_95_195)">
                        <path d="M9.5 0V19" [attr.stroke]="isAdding ? '#D966BC' : '#ffffff'" stroke-width="2"/> 
                        <path d="M19 9.5H0" [attr.stroke]="isAdding ? '#D966BC' : '#ffffff'" stroke-width="2"/>
                    </g>
                </svg>
            </div>
        </button>
        <hr class="text-light-bg/20 border-1 w-75 flex"> 
        <div class="border-3 border-dashed border-light-bg/20 p-3 w-full h-[35vh] rounded-4xl" style="border-spacing: 10px;">
            <div class="w-full flex flex-col gap-3 overflow-scroll h-full">
            <app-question-edit-item [isAdding]="true" [item]="{id:createList.length.toString(), text: '', level: 0}" (currentValue)="checkCreate($event)" (submitItem)="createList.push($event)" *ngIf="isAdding"></app-question-edit-item>
            <app-question-edit-item [isAdding]="true" [isAdded]="true" *ngFor="let question of createList; trackBy: trackById" [item]="question" (currentValue)="checkCreate($event)" (submitItem)="removeItem($event.id)"></app-question-edit-item>
                <app-question-edit-item *ngFor="let question of localQuestions; trackBy: trackById" [item]="question" (currentValue)="checkRequest($event)" (submitItem)="checkDelete(question)" [ngClass]="{'hidden':deleteList.includes(question.id), 'opacity-30': isAdding}"></app-question-edit-item>
            </div>
        </div>
        <!-- <p>total: {{total}} Question{{total > 1 ? 's':''}}</p> -->
        <button (click)="submitRequest()">save all change</button>
    </div>
  `,
    styles: `
  `,
    standalone: true
})
export class EditListComponent {

    @Input() questions: QuestionsText[] = []

    localQuestions: QuestionsText[] = []

    @Output() updateRequest = new EventEmitter<QuestionsText[]>()
    @Output() deleteRequest = new EventEmitter<string[]>()
    @Output() createRequest = new EventEmitter<QuestionsText[]>()

    @ViewChild(QuestionEditItemComponent) questionEditItemComponent!: QuestionEditItemComponent;

    isAdding: boolean = false

    updateList: QuestionsText[] = []
    deleteList: string[] = []
    createList: QuestionsText[] = []

    ngOnChanges(changes: SimpleChanges) {
        if (changes['questions'] && this.questions) {
            this.localQuestions = this.questions
            this.deleteList = [];
            this.updateList = [];
            this.createList = [];
            this.isAdding = false;
        }
    }

    checkRequest(item: CurrentValue) {
        const idList = this.updateList.map(e => e.id)
        if (!idList.includes(item.id) && item.isEditing) {
            this.updateList.push({
                id: item.id,
                level: item.level,
                text: item.text
            })
        }
        else if (item.isEditing) {
            this.updateList = this.updateList.map(e => {
                return e.id === item.id ? { id: item.id, level: item.level, text: item.text } : e
            })
        }
        else if (idList.includes(item.id) && !item.isEditing) {
            this.updateList = this.updateList.filter(e => e.id !== item.id)
        }
    }

    checkDelete(item: QuestionsText) {
        const total = this.localQuestions.length + this.createList.length
        if (total > 1) {
            this.deleteList.push(item.id)
            this.localQuestions = this.localQuestions.filter(e => e.id !== item.id);
        }
        else {
            //alert can't delete anymore
        }
    }

    checkCreate(item: QuestionsText) {

    }

    submitRequest() {
        this.updateRequest.emit(this.updateList)
        this.deleteRequest.emit(this.deleteList)
        this.createRequest.emit(this.createList)
    }

    removeItem(id: string) {
        this.createList = this.createList.filter(e => e.id !== id);
    }

    trackById(index: number, item: QuestionsText) {
        return item.id;
    }

    addingBtn() {
        if (this.isAdding) {
            this.questionEditItemComponent.undo();
        }
        this.isAdding = !this.isAdding;
    }
}