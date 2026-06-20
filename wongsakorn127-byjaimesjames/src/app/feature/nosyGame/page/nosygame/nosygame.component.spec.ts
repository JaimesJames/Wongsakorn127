import { QuestionsText } from '../../../../../core/nosyGame/entities/QuestionsText';
import { NosygameComponent } from './nosygame.component';

describe('NosygameComponent', () => {
  it('should create', () => {
    const component = createComponent();

    expect(component).toBeTruthy();
  });

  it('handles an empty question set without recursing', () => {
    const component = createComponent();

    component.questions = [];
    component.previousQuestions = [];
    component.randomQuestion();

    expect(component.selectedQuestion.text).toBe('');
  });

  it('selects and removes the only available question', () => {
    const component = createComponent();
    const question = new QuestionsText('q-1', 1, 'Question');

    component.questions = [question];
    component.randomQuestion();

    expect(component.selectedQuestion).toBe(question);
    expect(component.questions).toEqual([]);
    expect(component.previousQuestions).toEqual([question]);
  });
});

function createComponent(): NosygameComponent {
  const questionService = {};
  const router = {};
  const route = {
    snapshot: {
      queryParamMap: {
        get: () => 'game',
      },
    },
  };
  const authService = {};

  return new NosygameComponent(
    questionService as never,
    router as never,
    route as never,
    authService as never,
    'server',
  );
}
