export class FirebaseAppError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        public readonly originalError?: unknown,
    ) {
        super(message);
        this.name = 'FirebaseAppError';
    }
}

export function toFirebaseAppError(error: unknown, fallbackMessage = 'Firebase request failed'): FirebaseAppError {
    if (error instanceof FirebaseAppError) return error;

    const code = getFirebaseErrorCode(error);
    const message = getFirebaseErrorMessage(error) || fallbackMessage;

    return new FirebaseAppError(code, message, error);
}

export function getFirebaseUserMessage(error: unknown): string {
    const code = getFirebaseErrorCode(error);

    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Email or password is incorrect.';
        case 'auth/popup-closed-by-user':
            return 'Google sign-in was cancelled.';
        case 'auth/network-request-failed':
        case 'unavailable':
            return 'Network issue. Please check your connection and try again.';
        case 'permission-denied':
            return 'Firebase permission denied. Please check Firestore security rules.';
        case 'unauthenticated':
            return 'Please log in before making this change.';
        case 'resource-exhausted':
            return 'Firebase quota was reached. Please try again later.';
        case 'not-found':
            return 'The requested data was not found.';
        default:
            return 'Something went wrong. Please try again.';
    }
}

function getFirebaseErrorCode(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = (error as { code?: unknown }).code;
        if (typeof code === 'string' && code.length > 0) return code;
    }

    if (error instanceof Error) {
        const match = error.message.match(/\[([a-zA-Z0-9/_-]+)\]/);
        if (match?.[1]) return match[1];
    }

    return 'unknown';
}

function getFirebaseErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;

    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === 'string') return message;
    }

    return '';
}
