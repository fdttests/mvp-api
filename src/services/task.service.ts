import Task from "../models/task";
import TaskRepository from "../repositories/task.repository";

export default class TaskService {
    public async getByUserId(userId: number): Promise<Task[]> {
        const taskRepository = new TaskRepository();

        return await taskRepository.getByUserId(userId);
    }

    public async create(args: {name: string, description: string, status: string, userId: number}): Promise<Task> {
        const taskRepository = new TaskRepository();

        const task = new Task({
            name: args.name,
            description: args.description,
            status: args.status,
            userId: args.userId,
        });

        return await taskRepository.create(task);
    }

    public async update(args: {id: number, name: string, description: string, status: string, userId: number}): Promise<Task> {
        const taskRepository = new TaskRepository();

        const task = new Task({
            id: args.id,
            name: args.name,
            description: args.description,
            status: args.status,
            userId: args.userId,
        });

        return await taskRepository.update(task);
    }

    public async findByUserIdAndId(args: {userId: number, id: number}): Promise<Task | null> {
        const taskRepository = new TaskRepository();

        return await taskRepository.findByUserIdAndId(args.userId, args.id);
    }

    public async destroy(args: {userId: number, id: number}): Promise<void> {
        const taskRepository = new TaskRepository();

        return await taskRepository.deleteByUserIdAndId(args.userId, args.id);
    }
}