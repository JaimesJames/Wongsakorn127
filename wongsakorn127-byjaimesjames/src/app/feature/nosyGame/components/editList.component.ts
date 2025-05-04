import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { QuestionEditItemComponent } from './questionEditItem.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ConfirmDialogComponent } from '../../../share/components/dialog/confirmDialog.component';
import { AlertDialogComponent } from '../../../share/components/dialog/alertDialog.component';
import { QuestionsText } from '../../../../core/nosyGame/entities/QuestionsText';
import { RequestSet } from '../../../../core/nosyGame/entities/RequestSet';
import { CurrentValue } from '../../../../core/nosyGame/entities/CurrentValue';


@Component({
    selector: 'app-edit-list',
    imports: [CommonModule, QuestionEditItemComponent, ReactiveFormsModule, FormsModule, TextFieldModule, ConfirmDialogComponent, AlertDialogComponent],
    template: `
    <app-alert-dialog></app-alert-dialog>
    <app-confirm-dialog></app-confirm-dialog>
    <div class="flex flex-col justify-center items-center gap-2 w-full max-w-[630px] m-auto">
        <div class="flex justify-center gap-3 my-5 px-4 w-full" [ngClass]="{ '': isCreateNewSet, 'bg-black/10 rounded-full py-2':!isCreateNewSet }">
            <img *ngIf="!isCreateNewSet" src="/svg/edit-light.svg" class="p-2 w-10" alt="edit-dark" />
            <textarea 
            *ngIf="!isCreateNewSet"
            cdkTextareaAutosize
                class="text-white font-semibold w-full border-l-2 border-black/10 resize-none focus:outline-none focus:ring-0 text-2xl px-5" 
                [formControl]="questionSetName"
            ></textarea>
            <h2 class="text-white" *ngIf="isCreateNewSet">Type the name and create at least one question!</h2>
        </div>
        <button [disabled]="isCreateNewSet" (click)="addingBtn()" [ngClass]="{'border-[#D966BC] w-35':isAdding && !isCreateNewSet, 'border-light-bg w-full':!isAdding && !isCreateNewSet, 'border-light-bg/90 w-70':isCreateNewSet }" class="h-[55px] border-2 rounded-4xl flex justify-center items-center p-4 transition-all duration-200">
            <img *ngIf="isCreateNewSet" src="/svg/edit-light.svg" class="p-2 w-10" alt="edit-dark" />
            <textarea *ngIf="isCreateNewSet" cdkTextareaAutosize [formControl]="newQuestionSet" class="text-white w-full border-l-2 border-white/10 focus:outline-none focus:ring-0 h-fit px-5"></textarea>
            <div *ngIf="!isCreateNewSet" [ngClass]="{'rotate-45':isAdding}" class="transition-all duration-200">
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
            <div class="w-full flex flex-col gap-3 overflow-y-scroll h-full hide-scrollbar">
            <app-question-edit-item [isAdding]="true" [item]="newQuestion()" (submitItem)="addToCreateList($event)" *ngIf="isAdding || isCreateNewSet"></app-question-edit-item>
            <app-question-edit-item [isAdding]="true" [isAdded]="true" *ngFor="let question of createList; trackBy: trackById" [item]="question" (currentValue)="checkCreate($event)" (submitItem)="removeItem($event.id)"></app-question-edit-item>
                <app-question-edit-item *ngFor="let question of localQuestions; trackBy: trackById" [item]="question" (currentValue)="checkRequest($event)" (submitItem)="checkDelete(question)" [ngClass]="{'hidden':deleteList.includes(question.id) || isCreateNewSet, 'opacity-30 pointer-events-none': isAdding}"></app-question-edit-item>
            </div>
        </div>
        <!-- <p>total: {{total}} Question{{total > 1 ? 's':''}}</p> -->
        <button (click)="submitRequest()" [disabled]="!isEnableSave" class="w-full h-[46px] rounded-full font-semibold" [ngClass]="{'bg-light-bg': isEnableSave,  'border-2 border-light-bg text-light-bg opacity-40': !isEnableSave}">{{isCreateNewSet?'create new':'save all change'}}</button>
    </div>
    
  `,
    styles: `
        .hide-scrollbar::-webkit-scrollbar {
        display: none;
        }

        /* ซ่อน scrollbar บน Firefox */
        .hide-scrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE and Edge */
        }
  `,
    standalone: true
})
export class EditListComponent {

    @Input() setName: string = ''
    @Input() questions: QuestionsText[] = []

    localQuestions: QuestionsText[] = []

    @Output() request = new EventEmitter<RequestSet>()

    @ViewChild(QuestionEditItemComponent) questionEditItemComponent!: QuestionEditItemComponent;
    @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;
    @ViewChild(AlertDialogComponent) alertDialog!: AlertDialogComponent;

    isAdding: boolean = false
    @Input() isCreateNewSet: boolean = false

    updateList: QuestionsText[] = []
    deleteList: string[] = []
    createList: QuestionsText[] = []
    updateCreateList: QuestionsText[] = []

    questionSetName = new FormControl(
        { value: '', disabled: this.isCreateNewSet },
        Validators.required
    );
    newQuestionSet = new FormControl<string>('')

    newQuestion(): QuestionsText {
        return new QuestionsText(this.createList.length.toString(), 0, '');
    }

    get isEnableSave(): boolean {
        const hasChanges =
            this.updateList.length > 0 ||
            this.createList.length > 0 ||
            this.deleteList.length > 0 ||
            (this.questionSetName.value != this.setName &&
                this.questionSetName.value != '');

        const hasNewSetReady =
            this.createList.length > 0 &&
            this.newQuestionSet.value !== '';
        const hasEmptyText = [...this.updateList, ...this.updateCreateList].some(
            (q) => q.text.trim() === ''
        );

        return (
            !hasEmptyText && (!this.isCreateNewSet && hasChanges) || (this.isCreateNewSet && hasNewSetReady)
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['questions'] && this.questions || changes['isCreateNewSet']) {
            this.localQuestions = this.questions
            this.deleteList = [];
            this.updateList = [];
            this.createList = [];
            this.isAdding = false;
            this.questionSetName.setValue(this.setName)
        }
    }

    checkRequest(item: CurrentValue) {
        const idList = this.updateList.map(e => e.id)
        if (!idList.includes(item.id) && item.isEditing) {
            this.updateList.push(new QuestionsText(item.id, item.level, item.text));
        }
        else if (item.isEditing) {
            this.updateList = this.updateList.map(e =>
                e.id === item.id ? new QuestionsText(item.id, item.level, item.text) : e
            );
        }
        else if (idList.includes(item.id) && !item.isEditing) {
            this.updateList = this.updateList.filter(e => e.id !== item.id)
        }
    }

    async checkDelete(item: QuestionsText) {
        const total = this.localQuestions.length + this.createList.length
        if (total > 1) {
            this.deleteList.push(item.id)
            this.localQuestions = this.localQuestions.filter(e => e.id !== item.id);
        }
        else {
            await this.alertDialog.open(
                'Could not delete more question',
                'It should have atleast one question in the set'
            );
        }
    }

    checkCreate(item: CurrentValue) {
        console.log(item)
        const idList = this.updateCreateList.map(e => e.id)
        if (!idList.includes(item.id) && item.isEditing) {
            this.updateCreateList.push(new QuestionsText(item.id, item.level, item.text));
        }
        if (item.isEditing) {
            this.updateCreateList = this.updateCreateList.map(e =>
                e.id === item.id ? new QuestionsText(item.id, item.level, item.text) : e
            );
        }
        else {

        }

    }

    addToCreateList(newItem: QuestionsText) {
        this.createList.push(newItem)
    }

    mergeChanges(original: QuestionsText[], changed: QuestionsText[]) {

        const changedMap = new Map(changed.map(item => [item.id, item]));

        return original.map(orig => {
            const changedItem = changedMap.get(orig.id);
            if (!changedItem) return orig;

            const isDifferent =
                orig.text !== changedItem.text || orig.level !== changedItem.level;

            return isDifferent ? changedItem : orig;
        });
    }

    async submitRequest() {
        if(this.isCreateNewSet){
            const confirmed = await this.confirmDialog.open(
                'Create new set',
                'click continue to create'
              );
              if (!confirmed) {
                return
              }
        }
        else{
            const confirmed = await this.confirmDialog.open(
                'Update set',
                'click continue to update'
            );
            if (!confirmed) {
                return
            }
        }
        if (this.createList.length > 0) this.createList = this.mergeChanges(this.createList, this.updateCreateList)
        this.request.emit(new RequestSet(
            this.isCreateNewSet ? this.newQuestionSet.value || '' : this.questionSetName.value || '' !== this.setName ? this.questionSetName.value || '' : '',
            this.createList,
            this.updateList,
            this.deleteList,
        ))
        this.deleteList = [];
        this.updateList = [];
        this.createList = [];

    }

    async removeItem(id: string) {
        const total = this.localQuestions.length + this.createList.length
        if (total > 1) {
            this.createList = this.createList.filter(e => e.id !== id);
        }
        else {
            await this.alertDialog.open(
                'Could not delete more question',
                'It should have atleast one question in the set'
            );
        }

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