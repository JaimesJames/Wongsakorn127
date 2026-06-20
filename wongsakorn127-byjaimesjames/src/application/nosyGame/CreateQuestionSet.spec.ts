import { QuestionDetail } from '../../core/nosyGame/entities/QuestionDetail';
import { QuestionSetRepository } from '../../core/nosyGame/repositories/QuestionSetRepository';
import { CreateQuestionSet } from './CreateQuestionSet';

describe('CreateQuestionSet', () => {
    it('delegates set creation to the repository', async () => {
        const repository = jasmine.createSpyObj<QuestionSetRepository>(
            'QuestionSetRepository',
            ['createQuestionSet'],
        );
        repository.createQuestionSet.and.resolveTo();

        const questions = [new QuestionDetail(1, 'First question')];
        const useCase = new CreateQuestionSet(repository);

        await useCase.execute({ setName: 'Friends', questions });

        expect(repository.createQuestionSet).toHaveBeenCalledOnceWith(
            'Friends',
            questions,
        );
    });

    it('propagates repository errors', async () => {
        const repository = jasmine.createSpyObj<QuestionSetRepository>(
            'QuestionSetRepository',
            ['createQuestionSet'],
        );
        repository.createQuestionSet.and.rejectWith(new Error('Denied'));

        const useCase = new CreateQuestionSet(repository);

        await expectAsync(
            useCase.execute({ setName: 'Friends', questions: [] }),
        ).toBeRejectedWithError('Denied');
    });
});
