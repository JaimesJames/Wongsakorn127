import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ConfirmDialogComponent } from '../../../share/components/dialog/confirmDialog.component';
import { combineLatest } from 'rxjs';
import { QuestionsText } from '../../../../core/nosyGame/entities/QuestionsText';
import { CurrentValue } from '../../../../core/nosyGame/entities/CurrentValue';

@Component({
  selector: 'app-question-edit-item',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TextFieldModule, ConfirmDialogComponent],
  template: `
  <div [ngClass]="{'bg-[#CAFF74]':isAdding, 'bg-light-bg' : !isAdding}" class="flex w-full rounded-3xl px-5 py-4 items-center gap-5"> 
    <textarea cdkTextareaAutosize [formControl]="questionControl" class="text-black w-full focus:outline-none focus:ring-0 h-fit"></textarea>
    <input type="number" [formControl]="levelControl" [ngClass]="{'border-[#33374B]/20':isAdding, 'border-[#E7E9F4]' : !isAdding}" class="text-black w-15 text-center border-l-2 border-r-2 px-3 focus:outline-none focus:ring-0"/>
    <button (click)="undo()" [ngClass]="{'hidden': !isEditing || isAdding && !isAdded}">
        <img src="/svg/undo.svg" class="w-8" alt="undo"/>
    </button>
    <button (click)="submit()" [ngClass]="{'hidden': isEditing || isAdding && !isAdded}">
        <img src="/svg/remove-list.svg" class="w-8" alt="undo"/>
    </button>
    <button (click)="submit()" [ngClass]="{'hidden': !isAdding || isAdded, 'opacity-50': !isEditing || questionControl.value == ''}" [disabled]="!isEditing || questionControl.value == ''">
        <img src="/svg/submit.svg" class="w-8" alt="edit"/>
    </button>
  </div>
  <app-confirm-dialog></app-confirm-dialog>
  `,
  styles: ``,
  standalone: true
})
export class QuestionEditItemComponent {
  isEditing: boolean = false

  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;
  @Input() item = new QuestionsText('', 0, '')
  @Input() isAdding: boolean = false
  @Input() isAdded: boolean = false

  @Output() currentValue = new EventEmitter<CurrentValue>();
  @Output() submitItem = new EventEmitter<QuestionsText>();

  questionControl = new FormControl('');
  levelControl = new FormControl(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.isAdded) {
      this.questionControl.setValue(this.item.text);
      this.levelControl.setValue(this.item.level);
    }
  }

  ngOnInit() {
    combineLatest([
      this.questionControl.valueChanges,
      this.levelControl.valueChanges,
    ]).subscribe(([textVal, levelVal]) => {
      const text = textVal ?? '';
      const level = levelVal ?? 0;

      const isTextChanged = text !== this.item.text;
      const isLevelChanged = level !== this.item.level;
      const isChanged = isTextChanged || isLevelChanged;

      this.currentValue.emit(new CurrentValue(
        this.item.id,
        level,
        text,
        isChanged)
      );

      this.isEditing = isChanged;

    });

    this.questionControl.setValue(this.item.text);
    this.levelControl.setValue(this.item.level);
  }

  submit() {
    this.submitItem.emit(new QuestionsText(
      this.item.id,
      this.levelControl.value || this.item.level,
      this.questionControl.value || this.item.text,
    ))
    this.questionControl.setValue(this.item.text)
    this.levelControl.setValue(this.item.level)
  }

  undo() {
    this.questionControl.setValue(this.item.text)
    this.levelControl.setValue(this.item.level)
  }

}