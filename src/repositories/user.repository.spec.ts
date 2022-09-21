import { Sequelize } from "sequelize-typescript";
import UserEntity from "../entities/user.entity";
import User from "../models/user";
import UserRepository from "./user.repository";

describe('UserRepository', () => {
    beforeEach(async () => {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([UserEntity]);
        await sequelize.sync();
    });

    it('should create a user', async () => {
        const userRepository = new UserRepository();
        const user = new User({
            name: 'John Doe',
            email: 'john@doe.com',
            plainPassword: '123456'
        });

        const createdUser = await userRepository.create(user);
        const dbUser = await UserEntity.findByPk(<number>createdUser.getId());

        expect(dbUser).not.toBeNull();
        expect(dbUser?.toJSON()).toStrictEqual({
            id: createdUser.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getHashedPassword()
        });
    });

    it('should find a user by email', async () => {
        const userRepository = new UserRepository();
        
        const user1 = new User({
            name: 'John Doe',
            email: 'john@doe.com',
            plainPassword: '123456'
        });

        const user2 = new User({
            name: 'Jane Doe',
            email: 'jane@doe.com',
            plainPassword: '123456'
        });

        const createdUser1 = await userRepository.create(user1);
        const createdUser2 = await userRepository.create(user2);
        
        const foundUser1 = await userRepository.findByEmail(user1.getEmail());
        const foundUser2 = await userRepository.findByEmail(user2.getEmail());

        expect(foundUser1).toEqual(createdUser1);
        expect(foundUser2).toEqual(createdUser2);
    });
});