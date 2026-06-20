import {
    FirebaseAppError,
    getFirebaseUserMessage,
    toFirebaseAppError,
} from './firebaseError';

describe('Firebase error mapping', () => {
    it('preserves Firebase error codes when wrapping an error', () => {
        const original = {
            code: 'permission-denied',
            message: 'Missing or insufficient permissions.',
        };

        const result = toFirebaseAppError(original);

        expect(result).toEqual(jasmine.any(FirebaseAppError));
        expect(result.code).toBe('permission-denied');
        expect(result.message).toBe(original.message);
        expect(result.originalError).toBe(original);
    });

    it('does not wrap an existing FirebaseAppError again', () => {
        const original = new FirebaseAppError('unauthenticated', 'Please log in');

        expect(toFirebaseAppError(original)).toBe(original);
    });

    it('maps Firestore permission errors to a useful message', () => {
        const message = getFirebaseUserMessage(
            new FirebaseAppError('permission-denied', 'Denied'),
        );

        expect(message).toContain('security rules');
    });

    it('maps Firebase quota errors to a useful message', () => {
        const message = getFirebaseUserMessage(
            new FirebaseAppError('resource-exhausted', 'Quota reached'),
        );

        expect(message).toContain('quota');
    });

    it('falls back to a safe generic message for unknown errors', () => {
        expect(getFirebaseUserMessage(new Error('Unexpected'))).toBe(
            'Something went wrong. Please try again.',
        );
    });
});
