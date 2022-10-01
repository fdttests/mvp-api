import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize-typescript';
import TaskEntity from './entities/task.entity';
import UserEntity from './entities/user.entity';
import Task from './models/task';
import User from './models/user';
import TaskRepository from './repositories/task.repository';
import UserRepository from './repositories/user.repository';

dotenv.config();

const seed = async () => {
    console.log('Seeding database...');

    const conn = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: <number><unknown>process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_NAME,
        logging: false,
    });

    conn.addModels([UserEntity, TaskEntity]);

    const userRepository = new UserRepository();
    const taskRepository = new TaskRepository();

    const user1 = new User({name: 'User 1', email: 'user_1@gmail.com', plainPassword: '123456'});
    const user2 = new User({name: 'User 2', email: 'user_2@gmail.com', plainPassword: '654321'});

    const createdUser1 = await userRepository.create(user1);
    const createdUser2 = await userRepository.create(user2);

    for(let i = 1; i <= 5; i++) {
        const task1 = new Task({name: `Task ${i} - User 1`, description: `Description ${i} - User 1`, status: 'todo', userId: <number>createdUser1.getId()});
        const task2 = new Task({name: `Task ${i} - User 2`, description: `Description ${i} - User 2`, status: 'todo', userId: <number>createdUser2.getId()});

        await taskRepository.create(task1);
        await taskRepository.create(task2);
    }

    console.log('Seed finished!');
};

seed();
