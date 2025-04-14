import { Component } from '@angular/core';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';
import { selectionBarComponent } from '../../../../share/components/input/selectionBar.component';
import { question } from '../../data';
import { AuthService } from '../../../../share/services/auth.service';
import { User } from '@angular/fire/auth';
import { QuestionService } from '../../services/question.service';
import { QuestionSet } from '../../models/nosygame.model';
import { Selector } from '../../../../share/models/share.model';

@Component({
  selector: 'app-nosygame',
  imports: [CreditBadgeComponent, selectionBarComponent],
  templateUrl: './nosygame.component.html',
  styleUrl: './nosygame.component.css',
  standalone: true
})
export class NosygameComponent {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User:', this.user);
  
      if (this.user) {
       
      }
    }); 
    this.getQuestionSet();
  }

  selectors:Selector[] = [{
    sequence: 0,
    text: '',
    selectorId: ''
  }];

  selectedValue = '';
  selectedText: string = '';

  questions = question[0];
  previousQuestions: string[] = [];


  onDropdownSelected(value: string) {
    try {
      this.selectedValue = value;
      const foundQuestion = question.find(e => e.id === this.selectedValue);
      if (foundQuestion) {
        this.questions = foundQuestion;
        // this.randomQuestion()
      } else {
        console.warn('Question not found for the selected value');
        this.questions = question[0];
      }
    } catch (error) {
      console.error('An error occurred while processing the selection:', error);
    }
  }
  // randomQuestion() {
  //   if (this.questions.text.length > 0){
  //     const randomIndex = Math.floor(Math.random() * this.questions.text.length);
  //     this.selectedText = this.questions.text.splice(randomIndex, 1)[0];

  //     this.previousQuestions.push(this.selectedText);
  //   }
  //   else {
  //     this.questions.text = [...this.previousQuestions];
  //     this.previousQuestions = [];
  //     this.randomQuestion(); 
  //   }
  // }

  async addQuestion() {
    await this.questionService.addQuestionToSet(
      'questionsSet1',
      'คำถามตัวอย่าง',
      'คำตอบตัวอย่าง'
    )
  }

  async getQuestionSet() {
    const data = await this.questionService.getAllQuestionSet();
    console.log(data,"ll");
    this.selectors = data.map((e)=>{
      return {
        sequence: 0,
        text: e.name,
        selectorId: e.id
      }
    })
    const test = await this.questionService.getQuestions(this.selectors[0].selectorId)
  }

}
