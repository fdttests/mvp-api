import Task from './task';

describe('Task', () => {
    it('should create a task', () => {
        const task = new Task({
            name: 'Task 1',
            description: 'Description 1',
            status: 'todo',
            userId: 1
        });

        expect(task.getId()).toBeUndefined();
        expect(task.getName()).toBe('Task 1');
        expect(task.getDescription()).toBe('Description 1');
        expect(task.getStatus()).toBe('todo');
    });

    it('should throw an error if name is not provided', () => {
        expect(() => {
            new Task(<any>{
                description: 'Description 1',
                status: 'todo'
            });
        }).toThrowError('Name is required');
    });

    it('should throw an error if description is not provided', () => {
        expect(() => {
            new Task(<any>{
                name: 'Task 1',
                status: 'todo'
            });
        }).toThrowError('Description is required');
    });

    it('should throw an error if status is not provided', () => {
        expect(() => {
            new Task(<any>{
                name: 'Task 1',
                description: 'Description 1'
            });
        }).toThrowError('Status is invalid');
    });

    it('should throw an error if status is not invalid', () => {
        expect(() => {
            new Task(<any>{
                name: 'Task 1',
                description: 'Description 1',
                status: 'invalid'
            });
        }).toThrowError('Status is invalid');
    });
});