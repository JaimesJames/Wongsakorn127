import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';
import { selectionBarComponent } from '../../../../share/components/input/selectionBar.component';
import { QuestionService } from '../../services/question.service';
import { QuestionsText, RequestSet } from '../../models/nosygame.model';
import { Selector } from '../../../../share/models/share.model';
import { EditListComponent } from '../../components/editList.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '../../../../share/components/dialog/confirmDialog.component';
import { InitialLoadingComponent } from '../../../../share/components/loading/initialLoading.component';
import { AuthService } from '../../../../share/services/auth/auth.service';

@Component({
  selector: 'app-nosygame',
  imports: [CreditBadgeComponent, selectionBarComponent, EditListComponent, CommonModule, RouterModule, ConfirmDialogComponent, InitialLoadingComponent],
  templateUrl: './nosygame.component.html',
  styleUrl: './nosygame.component.css',
  standalone: true
})
export class NosygameComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;
  @ViewChild(EditListComponent) editList!: EditListComponent;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  isEditMode: boolean = false;
  isCreateSet: boolean = false;


  selectors: Selector[] = [{
    sequence: 0,
    text: '',
    selectorId: ''
  }];

  selectedSetName = ''
  selectedValue = '';
  selectedQuestion: QuestionsText = {
    id: '',
    level: 0,
    text: ''
  };

  questions: QuestionsText[] = [];
  previousQuestions: QuestionsText[] = [];

  isLoading: boolean = true;

  isLogin:boolean = false

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentMode = this.route.snapshot.queryParamMap.get('mode') || 'game';
    this.isEditMode = currentMode === 'edit'

    this.isLoading = true;

    try {
      const user = await this.authService.getCurrentUser()
      if(user) this.isLogin = true

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
        this.selectedSetName = this.selectors[0].text
        this.questions = await this.questionService.getQuestions(data[0].id)
        if (currentMode === 'game') this.randomQuestion()
      }
      if (!this.isLogin && this.isEditMode){
        this.router.navigate(['/nosy-game'])
      }
    } catch (error) {
      console.error("Error loading data", error);

    } finally {
      setTimeout(() => {
        this.isLoading = false
      }, 1000);
    }
 
  }
  async onDropdownSelected(item: { value: string, text: string }) {
    try {
      this.selectedValue = item.value;
      this.questions = await this.questionService.getQuestions(this.selectedValue)
      this.selectedSetName = item.text
      this.previousQuestions = [];
      if (!this.isEditMode) this.randomQuestion()
    } catch (error) {
      console.error('An error occurred while processing the selection:', error);
    } finally{

    }
  }

  randomQuestion() {
    if (this.questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.questions.length);
      this.selectedQuestion = this.questions[randomIndex];
      this.previousQuestions.push(this.questions[randomIndex]);
      this.questions.splice(randomIndex, 1)

    }
    else {
      this.questions = [...this.previousQuestions];
      this.previousQuestions = [];
      this.randomQuestion()
    }
  }

  async changeMode() {
    const currentMode = this.route.snapshot.queryParamMap.get('mode') || 'game';

    if (currentMode === "edit") {
      const isEditing = this.editList.isEnableSave
      if (isEditing) {
        const confirmed = await this.confirmDialog.open(
          'Exit Edit Mode',
          'all change would not save'
        );
        if (!confirmed) {
          return
        }
      }
      window.location.href = '/nosy-game';
    }

    this.router.navigate(['/nosy-game'], {
      queryParams: { mode: currentMode === "game" ? "edit" : "game" }
    })
    this.questions = await this.questionService.getQuestions(this.selectedValue)
    this.isEditMode = !this.isEditMode
  }

  async sendRequest(request: RequestSet) {
    try {
      if (this.isCreateSet) {
        const confirmed = await this.confirmDialog.open(
          'Create new set',
          'click continue to create'
        );
        if (!confirmed) {
          return
        }
        await this.questionService.addQuestionSet(request.setName, request.create)
        window.location.href = '/nosy-game';
      }
      else {
        await this.questionService.submitRequestSet(this.selectedValue, request)
        window.location.reload();
      }
    }
    catch (error) {

    } finally{
    }

  }

  async removeSet(setId: string) {
    try {
      const confirmed = await this.confirmDialog.open(
        'Remove Entire Set ?',
        'click continue to removed entire set'
      );
      if (!confirmed) {
        return
      }
      await this.questionService.deleteQuestionSet(setId)
      window.location.href = '/nosy-game';
    } catch (error) {

    } finally{
    }

  }
}


