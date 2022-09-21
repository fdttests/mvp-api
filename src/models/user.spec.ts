import User from "./user";

describe('User', () => {
    it('should create a user', () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@doe.com',
            plainPassword: '123456'
        });

        expect(user.getId()).toBeUndefined();
        expect(user.getName()).toBe('John Doe');
        expect(user.getEmail()).toBe('john@doe.com');
        expect(user.comparePassword('123456')).toBeTruthy();
    });

    it('should throw an error if name is not provided', () => {
        expect(() => {
            new User(<any>{
                email: 'john@doe.com',
                plainPassword: '123456'
            });
        }).toThrowError('Name is required');
    });

    it('should throw an error if email is not provided', () => {
        expect(() => {
            new User(<any>{
                name: 'John Doe',
                password: '123456'
            });
        }).toThrowError('Email is required');
    });

    it('should throw an error if password is not provided', () => {
        expect(() => {
            new User(<any>{
                name: 'John Doe',
                email: 'john@doe.com'
            });
        }).toThrowError('Password is required');
    });

    it('should encrypt password', () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@doe.com',
            plainPassword: '123456'
        });

        expect(user.comparePassword('123456')).toBeTruthy();
        expect(user.comparePassword('654321')).toBeFalsy();
        expect(user.getHashedPassword()).not.toBe('123456');
    });
});