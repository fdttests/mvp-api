import { Sequelize } from "sequelize-typescript";
import TaskEntity from "../entities/task.entity";
import UserEntity from "../entities/user.entity";
import Task from "../models/task";
import TaskRepository from "./task.repository";

describe('TaskRepository', () => {
    beforeEach(async () => {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([UserEntity, TaskEntity]);
        await sequelize.sync();
    });

    it('should create a task', async () => {
        const taskRepository = new TaskRepository();

        const user = await UserEntity.create({
            name: 'John Doe',
            email: 'jhon@doe.com',
            password: '123456',
        });

        const task = new Task({
            name: 'Task 1',
            description: 'Task 1 description',
            status: 'todo',
            userId: user.id,
        });

        const createdTask = await taskRepository.create(task);
        const dbTask = await TaskEntity.findByPk(<number>createdTask.getId());

        expect(dbTask?.toJSON()).toStrictEqual({
            id: createdTask.getId(),
            name: task.getName(),
            description: task.getDescription(),
            status: task.getStatus(),
            user_id: task.getUserId(),
        });    
    });

    it('should find a task by id', async () => {
        const taskRepository = new TaskRepository();

        const user = await UserEntity.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const task1 = new Task({
            name: 'Task 1',
            description: 'Task 1 description',
            status: 'todo',
            userId: user.id,
        });

        const task2 = new Task({
            name: 'Task 2',
            description: 'Task 2 description',
            status: 'todo',
            userId: user.id,
        });

        const createdTask1 = await taskRepository.create(task1);
        const createdTask2 = await taskRepository.create(task2);

        const foundTask1 = await taskRepository.findByUserIdAndId(user.id, <number>createdTask1.getId());
        const foundTask2 = await taskRepository.findByUserIdAndId(user.id, <number>createdTask2.getId());

        expect(foundTask1).toEqual(createdTask1);
        expect(foundTask2).toEqual(createdTask2);
    });

    it('should get tasks by user id', async () => {
        const taskRepository = new TaskRepository();

        const user1 = await UserEntity.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const user2 = await UserEntity.create({
            name: 'Jane Doe',
            email: 'jane@doe.com',
            password: '123456',
        });

        const task1 = new Task({
            name: 'Task 1',
            description: 'Task 1 description',
            status: 'todo',
            userId: user1.id,
        });

        const task2 = new Task({
            name: 'Task 2',
            description: 'Task 2 description',
            status: 'todo',
            userId: user1.id,
        });

        const task3 = new Task({
            name: 'Task 3',
            description: 'Task 3 description',
            status: 'todo',
            userId: user2.id,
        });

        const createdTask1 = await taskRepository.create(task1);
        const createdTask2 = await taskRepository.create(task2);
        const createdTask3 = await taskRepository.create(task3);

        const foundTasks1 = await taskRepository.getByUserId(<number>user1.id);
        const foundTasks2 = await taskRepository.getByUserId(<number>user2.id);

        expect(foundTasks1).toEqual([createdTask1, createdTask2]);
        expect(foundTasks2).toEqual([createdTask3]);
    });

    it('should delete a task by id', async () => {
        const taskRepository = new TaskRepository();

        const user = await UserEntity.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const task1 = new Task({
            name: 'Task 1',
            description: 'Task 1 description',
            status: 'todo',
            userId: user.id,
        });

        const task2 = new Task({
            name: 'Task 2',
            description: 'Task 2 description',
            status: 'todo',
            userId: user.id,
        });

        const createdTask1 = await taskRepository.create(task1);
        const createdTask2 = await taskRepository.create(task2);

        await taskRepository.deleteByUserIdAndId(user.id, <number>createdTask1.getId());

        const foundTasks = await taskRepository.getByUserId(<number>user.id);

        expect(foundTasks).toEqual([createdTask2]);
    });

    it('should update a task by id', async () => {
        const taskRepository = new TaskRepository();

        const user = await UserEntity.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const task1 = new Task({
            name: 'Task 1',
            description: 'Task 1 description',
            status: 'todo',
            userId: user.id,
        });

        const task2 = new Task({
            name: 'Task 2',
            description: 'Task 2 description',
            status: 'todo',
            userId: user.id,
        });

        const createdTask1 = await taskRepository.create(task1);
        const createdTask2 = await taskRepository.create(task2);

        createdTask1.changeName('Task 1 updated');
        createdTask1.changeDescription('Task 1 description updated');
        createdTask1.changeStatus('done');

        const updatedTask1 = await taskRepository.update(createdTask1);

        const foundTasks = await taskRepository.getByUserId(<number>user.id);

        expect(updatedTask1).toEqual(createdTask1);
        expect(foundTasks).toEqual([createdTask1, createdTask2]);
    });
});