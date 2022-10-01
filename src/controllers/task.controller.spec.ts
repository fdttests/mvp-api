import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import App from "../app";
import TaskController from "./task.controller";
import request from 'supertest';
import AuthController from "./auth.controller";
import AuthService from "../services/auth.service";
import TaskEntity from "../entities/task.entity";
import UserEntity from "../entities/user.entity";

let app: App;

describe('TaskController', () => {
    beforeEach(async () => {
        const dbConfig: SequelizeOptions = {
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        };

        app = new App(
            dbConfig,
            [new TaskController(), new AuthController()],
            [],
            0,
        );

        await app.boot();

        process.env.JWT_SECRET = 'secret';

        const conn = new Sequelize(dbConfig);
        conn.addModels([TaskEntity, UserEntity]);
        await conn.sync({ force: true });
    });

    const generateToken = async (email: string) => {
        const authService = new AuthService();

        await authService.register('John Doe', email, '123456');
        const token = await authService.login(email, '123456');

        return token;
    };

    it('should only list tasks from the authenticated user', async () => {
        const token1 = await generateToken('john1@doe.com');
        const token2 = await generateToken('john2@doe.com');

        const headers1 = { Authorization: `Bearer ${token1}` };
        const headers2 = { Authorization: `Bearer ${token2}` };

        await request(app.app).post('/api/tasks').set(headers1).send({
            data: {
                name: 'Task 1',
                description: 'Description 1',
                status: 'todo',
            }
        });

        await request(app.app).post('/api/tasks')
        .set(headers2)
        .send({
            data: {
                name: 'Task 2',
                description: 'Description 2',
                status: 'done',
            }
        });

        const response1 = await request(app.app).get('/api/tasks').set(headers1);
        const response2 = await request(app.app).get('/api/tasks').set(headers2);

        expect(response1.body.data).toHaveLength(1);
        expect(response1.body.data[0].name).toBe('Task 1');
        expect(response1.body.data[0].description).toBe('Description 1');
        expect(response1.body.data[0].status).toBe('todo');
        
        expect(response2.body.data).toHaveLength(1);
        expect(response2.body.data[0].name).toBe('Task 2');
        expect(response2.body.data[0].description).toBe('Description 2');
        expect(response2.body.data[0].status).toBe('done');
    });

    it('should create a task', async () => {
        const token = await generateToken('john@doe.com');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await request(app.app).post('/api/tasks').set(headers).send({
            data: {
                name: 'Task title',
                description: 'Task description',
                status: 'todo',
            },
        });

        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe('Task title');
        expect(response.body.data.description).toBe('Task description');
    });

    it('should update a task', async () => {
        const token = await generateToken('john@doe.com');
        const headers = { Authorization: `Bearer ${token}` };

        const task = await request(app.app).post('/api/tasks').set(headers).send({
            data: {
                name: 'Task title',
                description: 'Task description',
                status: 'todo',
            },
        });

        const response = await request(app.app).put(`/api/tasks/${task.body.data.id}`).set(headers).send({
            data: {
                name: 'Task title updated',
                description: 'Task description updated',
                status: 'done',
            },
        });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe('Task title updated');
        expect(response.body.data.description).toBe('Task description updated');
        expect(response.body.data.status).toBe('done');
    });

    it('should find a task', async () => {
        const token = await generateToken('john@doe.com');
        const headers = { Authorization: `Bearer ${token}` };

        const task = await request(app.app).post('/api/tasks').set(headers).send({
            data: {
                name: 'Task title',
                description: 'Task description',
                status: 'todo',
            },
        });

        const response = await request(app.app).get(`/api/tasks/${task.body.data.id}`).set(headers);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe('Task title');
        expect(response.body.data.description).toBe('Task description');
    });

    it('should not find a non existing task', async () => {
        const token = await generateToken('john@doe.com');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await request(app.app).get('/api/tasks/999').set(headers);

        expect(response.status).toBe(404);
    });

    it('should delete a task', async () => {
        const token = await generateToken('john@doe.com');
        const headers = { Authorization: `Bearer ${token}` };

        const task = await request(app.app).post('/api/tasks').set(headers).send({
            data: {
                name: 'Task title',
                description: 'Task description',
                status: 'todo',
            },
        });

        const response = await request(app.app).delete(`/api/tasks/${task.body.data.id}`).set(headers);

        expect(response.status).toBe(204);

        const responseNotFound = await request(app.app).get(`/api/tasks/${task.body.data.id}`).set(headers);

        expect(responseNotFound.status).toBe(404);
    });
});