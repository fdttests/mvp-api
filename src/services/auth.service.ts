import { sign, verify } from "jsonwebtoken";
import User from "../models/user";
import UserRepository from "../repositories/user.repository";

export default class AuthService {
    public async login(email: string, password: string): Promise<boolean | string> {
        const userRepository = new UserRepository();

        const user = await userRepository.findByEmail(email);

        if (!user) {
            return false
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return false
        }

        const token = sign({ id: user.getId() }, <string>process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return token;
    }

    public async register(name: string, email: string, password: string): Promise<User> {
        const userRepository = new UserRepository(); 

        const user = new User({
            name: name,
            email: email,
            plainPassword: password,
        });

        return await userRepository.create(user);
    }

    public async checkEmailExists(email: string): Promise<boolean> {
        const userRepository = new UserRepository();
        const user = await userRepository.findByEmail(email);

        return !!user;
    }

    public async validateToken(token: string): Promise<{id: number}> {
        const userRepository = new UserRepository();
        const decoded = verify(token, <string>process.env.JWT_SECRET) as {id: number};

        const user = await userRepository.findById(decoded.id);

        if (!user) {
            throw new Error('Invalid token');
        }

        return decoded;
    }
}