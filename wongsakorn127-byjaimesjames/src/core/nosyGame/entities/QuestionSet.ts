export class QuestionSet {
    constructor(
        public readonly id: string,
        public name: string,
        public readonly createdAt: Date
    ) { }

    rename(newName: string) {
        this.name = newName.trim()
    }

    static fromFirebase(data: {
        id: string
        name: string
        createdAt: { seconds: number; nanoseconds: number }
    }): QuestionSet {
        const date = new Date(data.createdAt.seconds * 1000)
        return new QuestionSet(data.id, data.name, date)
    }
}