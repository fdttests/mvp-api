import { Router, Request, Response } from 'express';
import { Joi, validate } from 'express-validation';
import Controller from '../@shared/controllers/controller';
import AuthenticatedRequest from '../@shared/requests/authenticated.request';
import AuthMiddleware from '../middlewares/auth.middleware';
import TaskService from '../services/task.service';

const taskValidation = {
    body: Joi.object({
        data: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            status: Joi.string().required(),
        }).required(),
    }),
};

export default class TaskController extends Controller {
    public router = Router();

    constructor() {
        super();

        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use((new AuthMiddleware).handle);

        this.router.get('/tasks', <any>this.index);
        this.router.get('/tasks/:id', <any>this.show);
        this.router.post('/tasks', validate(taskValidation), <any>this.store);
        this.router.put('/tasks/:id', validate(taskValidation), <any>this.update);
        this.router.delete('/tasks/:id', <any>this.destroy);
    }

    public async index(request: Request & AuthenticatedRequest, response: Response) {
        try {
            const taskService = new TaskService();

            const userId = request.auth.id;
            const tasks = await taskService.getByUserId(userId);

            response.status(200).json({
                data: tasks
            });
        } catch (ex) {
            console.error(ex);

            response.status(500).json({
                error: 'Internal server error',
            });
        }
    }

    public async show(request: Request & AuthenticatedRequest, response: Response) {
        try {
            const taskService = new TaskService();

            const userId = request.auth.id;
            const taskId = <number><unknown>request.params.id;
            const task = await taskService.findByUserIdAndId({id: taskId, userId: userId});

            if(!task) {
                return response.status(404).json({
                    error: 'Task not found',
                });
            }

            response.status(200).json({
                data: task
            });
        } catch (ex) {
            console.error(ex);

            response.status(500).json({
                error: 'Internal server error',
            });
        }
    }

    public async store(request: Request & AuthenticatedRequest, response: Response) {
        try {
            const taskService = new TaskService();

            const userId = request.auth.id;
            const task = await taskService.create({
                name: request.body.data.name,
                description: request.body.data.description,
                status: request.body.data.status,
                userId: userId,
            });

            response.status(201).json({
                data: task
            });
        } catch (ex) {
            console.error(ex);

            response.status(500).json({
                error: 'Internal server error',
            });
        }
    }

    public async update(request: Request & AuthenticatedRequest, response: Response) {
        try {
            const taskService = new TaskService();

            const userId = request.auth.id;
            const task = await taskService.update({
                id: <number><unknown>(request.params.id),
                name: request.body.data.name,
                description: request.body.data.description,
                status: request.body.data.status,
                userId: userId,
            });

            response.status(200).json({
                data: task
            });
        } catch (ex) {
            console.error(ex);

            response.status(500).json({
                error: 'Internal server error',
            });
        }
    }

    public async destroy(request: Request & AuthenticatedRequest, response: Response) {
        try {
            const taskService = new TaskService();

            const userId = request.auth.id;
            await taskService.destroy({
                id: <number><unknown>(request.params.id),
                userId: userId,
            });

            response.status(204).send();
        } catch (ex) {
            console.error(ex);

            response.status(500).json({
                error: 'Internal server error',
            });
        }
    }
}