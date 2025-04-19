import { Component, OnInit } from '@angular/core';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';
import { selectionBarComponent } from '../../../../share/components/input/selectionBar.component';
import { User } from '@angular/fire/auth';
import { QuestionService } from '../../services/question.service';
import { QuestionsText } from '../../models/nosygame.model';
import { Selector } from '../../../../share/models/share.model';
import { EditListComponent } from '../../components/editList.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nosygame',
  imports: [CreditBadgeComponent, selectionBarComponent, EditListComponent, CommonModule, RouterModule],
  templateUrl: './nosygame.component.html',
  styleUrl: './nosygame.component.css',
  standalone: true
})
export class NosygameComponent implements OnInit{
  user: User | null = null;

  constructor(
    private questionService: QuestionService,
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  isEditMode: Boolean = false;

  async ngOnInit() {
    const currentMode = this.route.snapshot.queryParamMap.get('mode') || 'game';
    this.isEditMode = currentMode === 'edit'

    const data = await this.questionService.getAllQuestionSet();
    if (data) {
      this.selectors = data.map((e) => {
        return {
          sequence: 0,
          text: e.name,
          selectorId: e.id
        }
      })
      this.selectedValue = data[0].id
      this.questions = await this.questionService.getQuestions(data[0].id)
      if (currentMode === 'game') this.randomQuestion()
    }
    
  }

  selectors: Selector[] = [{
    sequence: 0,
    text: '',
    selectorId: ''
  }];

  selectedValue = '';
  selectedQuestion: QuestionsText = {
    id: '',
    level: 0,
    text: ''
  };

  questions: QuestionsText[] = [];
  previousQuestions: QuestionsText[] = [];

  async onDropdownSelected(value: string) {
    try {
      this.selectedValue = value;
      this.questions = await this.questionService.getQuestions(this.selectedValue)
      this.previousQuestions = [];
      if (!this.isEditMode) this.randomQuestion()
    } catch (error) {
      console.error('An error occurred while processing the selection:', error);
    }
  }

  randomQuestion() {
    if (this.questions.length > 0){
      const randomIndex = Math.floor(Math.random() * this.questions.length);
      this.selectedQuestion = this.questions[randomIndex];
      this.previousQuestions.push(this.questions[randomIndex]);
      this.questions.splice(randomIndex,1)
      
    }
    else {
      this.questions = [...this.previousQuestions];
      this.previousQuestions = [];
      this.randomQuestion()
    }
  }

  async addQuestion() {
    await this.questionService.addQuestionToSet("NGS001", [{
      level: 0,
      text: ''
    }])
  }

  async addQuestionSet() {
    await this.questionService.addQuestionSet("setName", [{
      level: 0,
      text: ''
    }])
  }

  async getQuestions(questionSetId: string) {
    this.questions = await this.questionService.getQuestions(questionSetId)
  }

  async changeMode(){
    const currentMode = this.route.snapshot.queryParamMap.get('mode') || 'game';
    this.router.navigate(['/nosy-game'], {
      queryParams: {mode: currentMode === "game" ? "edit" : "game"}
    })
    this.questions = await this.questionService.getQuestions(this.selectedValue)
    this.isEditMode = !this.isEditMode
  }
}


