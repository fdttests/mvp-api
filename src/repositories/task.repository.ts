import TaskEntity from "../entities/task.entity";
import Task from "../models/task";

export default class TaskRepository {
    public async create(task: Task): Promise<Task> {
        const taskEntity = await TaskEntity.create({
            name: task.getName(),
            description: task.getDescription(),
            status: task.getStatus(),
            user_id: task.getUserId(),
        });

        return new Task({
            id: taskEntity.id,
            name: taskEntity.name,
            description: taskEntity.description,
            status: taskEntity.status,
            userId: taskEntity.user_id
        });
    }

    public async findByUserIdAndId(userId: number, id: number): Promise<Task | null> {
        const taskEntity = await TaskEntity.findOne({ where: { user_id: userId, id } });

        if (!taskEntity) {
            return null;
        }

        return new Task({
            id: taskEntity.id,
            name: taskEntity.name,
            description: taskEntity.description,
            status: taskEntity.status,
            userId: taskEntity.user_id
        });
    }

    public async update(task: Task): Promise<Task> {
        const taskEntity = await TaskEntity.findOne({ where: { user_id: task.getUserId(), id: task.getId() } });

        if (!taskEntity) {
            throw new Error('Task not found');
        }

        taskEntity.name = task.getName();
        taskEntity.description = task.getDescription();
        taskEntity.status = task.getStatus();
        taskEntity.user_id = task.getUserId();

        await taskEntity.save();

        return new Task({
            id: taskEntity.id,
            name: taskEntity.name,
            description: taskEntity.description,
            status: taskEntity.status,
            userId: taskEntity.user_id
        });
    }

    public async deleteByUserIdAndId(userId: number, id: number): Promise<void> {
        const taskEntity = await TaskEntity.findOne({ where: { user_id: userId, id } });

        if (!taskEntity) {
            throw new Error('Task not found');
        }

        await taskEntity.destroy();
    }

    public async getByUserId(userId: number): Promise<Task[]> {
        const taskEntities = await TaskEntity.findAll({ where: { user_id: userId } });

        return taskEntities.map((taskEntity) => new Task({
            id: taskEntity.id,
            name: taskEntity.name,
            description: taskEntity.description,
            status: taskEntity.status,
            userId: taskEntity.user_id
        }));
    }
}