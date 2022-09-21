export default class Task {
    private id: number | undefined;
    private name!: string;
    private description!: string;
    private status!: string;
    private userId!: number;

    constructor(args: {id?: number | undefined, name: string, description: string, status: string, userId: number}) {
        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.status = args.status;
        this.userId = args.userId;

        this.validate();
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getStatus(): string {
        return this.status;
    }

    public getUserId() {
        return this.userId;
    }

    public changeStatus(status: string) {
        this.status = status;
    }

    public changeName(name: string) {
        this.name = name;
    }

    public changeDescription(description: string) {
        this.description = description;
    }

    private validate() {
        if (!this.name) {
            throw new Error('Name is required');
        }

        if (!this.description) {
            throw new Error('Description is required');
        }

        if (!['todo', 'in_progress', 'done'].includes(this.status)) {
            throw new Error('Status is invalid');
        }

        if (!this.userId) {
            throw new Error('User is required');
        }
    }
}