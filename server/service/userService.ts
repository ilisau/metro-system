import User from "../model/User";

import bcrypt from 'bcrypt';

class UserService {

    #users: User[] //temporary

    constructor() {
        this.#users = [];
    }

    async getById(id: number): Promise<User> {
        const foundUser = this.#users.filter(u => u.id === id);
        if (foundUser.length) {
            return foundUser[0];
        } else {
            throw new Error("User not found.");
        }
    }

    async getByUsername(username: string): Promise<User> {
        const foundUser = this.#users.filter(u => u.username === username);
        if (foundUser.length) {
            return foundUser[0];
        } else {
            throw new Error("User not found.");
        }
    }

    async exists(username: string): Promise<boolean> {
        const foundUser = this.#users.filter(u => u.username === username);
        return !!foundUser.length;
    }

    async save(user: User) {
        user.id = this.#users.length + 1;
        bcrypt.hash(user.password, 10, function (err: Error | undefined, hash: string) {
            user.password = hash;
        });
        this.#users.push(user);
    }

}

export default new UserService();