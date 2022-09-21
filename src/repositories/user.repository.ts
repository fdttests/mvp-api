import UserModel from "../entities/user.entity";
import User from "../models/user";

export default class UserRepository {
    public async getAll(): Promise<UserModel[]> {
        return await UserModel.findAll();
    }

    public async create(user: User): Promise<User> {
        const dbUser = await UserModel.create({
            name: user.getName(),
            email: user.getEmail(),
            password: user.getHashedPassword()
        });

        return new User({id: dbUser.id, name: dbUser.name, email: dbUser.email, hashedPassword: dbUser.password});
    }

    public async findByEmail(email: string): Promise<User | null> {
        const dbUser = await UserModel.findOne({ where: { email } });

        if (!dbUser) {
            return null;
        }

        return new User({id: dbUser.id, name: dbUser.name, email: dbUser.email, hashedPassword: dbUser.password});
    }

    public async findById(id: number): Promise<User | null> {
        const dbUser = await UserModel.findOne({ where: { id } });

        if (!dbUser) {
            return null;
        }

        return new User({id: dbUser.id, name: dbUser.name, email: dbUser.email, hashedPassword: dbUser.password});
    }
}