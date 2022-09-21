import request from 'supertest';
import { SequelizeOptions } from 'sequelize-typescript';
import AuthController from './auth.controller';
import App from '../app';
import UserEntity from '../entities/user.entity';

let app: App;

describe('AuthController', () => {
    beforeEach(async () => {        
        const dbConfig: SequelizeOptions = {
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        };

        app = new App(
            dbConfig,
            [new AuthController()],
            [UserEntity],
            0,
        );

        process.env.JWT_SECRET = 'secret';

        await app.boot();
    });

    it('should create a new user', async () => {
        const response = await request(app.app).post('/api/auth/register').send({
            data: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: '123456',
            }
        });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('email');
    });

    it('should return an error when the name is missing', async () => {
        const response = await request(app.app).post('/api/auth/register').send({
            data: {
                email: 'john@doe.com',
                password: '123456',
            }
        });

        expect(response.status).toBe(400);
        expect(response.body.details.body).toHaveLength(1);
        expect(response.body.details.body[0].message).toBe('"data.name" is required');
    });

    it('should return an error when the email is missing', async () => {
        const response = await request(app.app).post('/api/auth/register').send({
            data: {
                name: 'John Doe',
                password: '123456',
            }
        });

        expect(response.status).toBe(400);
        expect(response.body.details.body).toHaveLength(1);
        expect(response.body.details.body[0].message).toBe('"data.email" is required');
    });

    it('should return an error when the password is missing', async () => {
        const response = await request(app.app).post('/api/auth/register').send({
            data: {
                name: 'John Doe',
                email: 'john@doe.com',
            }
        });

        expect(response.status).toBe(400);
        expect(response.body.details.body).toHaveLength(1);
        expect(response.body.details.body[0].message).toBe('"data.password" is required');
    });

    it('should return an error when the email is invalid', async () => {
        const response = await request(app.app).post('/api/auth/register').send({
            data: {
                name: 'John Doe',
                email: 'john@doe',
                password: '123456',
            }
        });

        expect(response.status).toBe(400);
        expect(response.body.details.body).toHaveLength(1);
        expect(response.body.details.body[0].message).toBe('"data.email" must be a valid email');
    });

    it('should login a user', async () => {
        await request(app.app).post('/api/auth/register').send({
            data: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: '123456',
            }
        });

        const response = await request(app.app).post('/api/auth/login').send({
            data: {
                email: 'john@doe.com',
                password: '123456',
            }
        });

        expect(response.status).toBe(200);
    });

    it('should return a error when trying to login with invalid email', async () => {
        await request(app.app).post('/api/auth/register').send({
            data: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: '123456',
            }
        });

        const response = await request(app.app).post('/api/auth/login').send({
            data: {
                email: 'john@doe1.com',
                password: '123456',
            }
        });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return a error when trying to login with invalid password', async () => {
        await request(app.app).post('/api/auth/register').send({
            data: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: '123456',
            }
        });

        const response = await request(app.app).post('/api/auth/login').send({
            data: {
                email: 'john@doe.com',
                password: '1234567',
            }
        });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });
});