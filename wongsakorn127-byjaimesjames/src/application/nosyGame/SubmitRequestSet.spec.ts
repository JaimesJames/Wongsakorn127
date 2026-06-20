import { QuestionDetail } from '../../core/nosyGame/entities/QuestionDetail';
import { QuestionsText } from '../../core/nosyGame/entities/QuestionsText';
import { RequestSet } from '../../core/nosyGame/entities/RequestSet';
import { QuestionSetRepository } from '../../core/nosyGame/repositories/QuestionSetRepository';
import { SubmitRequestSet } from './SubmitRequestSet';

describe('SubmitRequestSet', () => {
    let repository: jasmine.SpyObj<QuestionSetRepository>;
    let useCase: SubmitRequestSet;

    beforeEach(() => {
        repository = jasmine.createSpyObj<QuestionSetRepository>(
            'QuestionSetRepository',
            [
                'renameQuestionSet',
                'addQuestionsToset',
                'updateQuestions',
                'deleteQuestions',
            ],
        );
        repository.renameQuestionSet.and.resolveTo();
        repository.addQuestionsToset.and.resolveTo();
        repository.updateQuestions.and.resolveTo();
        repository.deleteQuestions.and.resolveTo();
        useCase = new SubmitRequestSet(repository);
    });

    it('executes every requested repository operation', async () => {
        const created = [new QuestionDetail(1, 'New question')];
        const updated = [new QuestionsText('q-1', 2, 'Updated question')];
        const deleted = ['q-2'];
        const request = new RequestSet('Renamed set', created, updated, deleted);

        await useCase.execute({ setId: 'set-1', request });

        expect(repository.renameQuestionSet).toHaveBeenCalledOnceWith(
            'set-1',
            'Renamed set',
        );
        expect(repository.addQuestionsToset).toHaveBeenCalledOnceWith(
            'set-1',
            created,
        );
        expect(repository.updateQuestions).toHaveBeenCalledOnceWith(
            'set-1',
            updated,
        );
        expect(repository.deleteQuestions).toHaveBeenCalledOnceWith(
            'set-1',
            deleted,
        );
    });

    it('skips repository operations for empty request fields', async () => {
        const request = new RequestSet('', [], [], []);

        await useCase.execute({ setId: 'set-1', request });

        expect(repository.renameQuestionSet).not.toHaveBeenCalled();
        expect(repository.addQuestionsToset).not.toHaveBeenCalled();
        expect(repository.updateQuestions).not.toHaveBeenCalled();
        expect(repository.deleteQuestions).not.toHaveBeenCalled();
    });
});
