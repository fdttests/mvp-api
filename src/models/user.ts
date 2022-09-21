import { hashSync, compareSync } from 'bcryptjs';

export default class User {
    private id!: number | undefined;
    private name!: string;
    private email!: string;
    private password!: string;

    constructor(args: {id?: number, name: string, email: string, plainPassword?: string, hashedPassword?: string}) {
        this.id = args.id;
        this.name = args.name;
        this.email = args.email;

        if (args.plainPassword) {
            this.setPlainPassword(args.plainPassword);
        }

        if (args.hashedPassword) {
            this.setHashedPassword(args.hashedPassword);
        }
        
        this.validate();
    }

    public validate() {
        if (!this.name) {
            throw new Error('Name is required');
        }

        if (!this.email) {
            throw new Error('Email is required');
        }

        if (!this.password) {
            throw new Error('Password is required');
        }
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setHashedPassword(hash: string) {
        this.password = hash;
    }

    public setPlainPassword(plainPassword: string) {
        this.password = hashSync(plainPassword, 8);
    }

    public comparePassword(plainPassword: string): boolean {
        return compareSync(plainPassword, this.password);
    }

    public getHashedPassword(): string {
        return this.password;
    }
}