import User from "../model/User";
import ExceptionMessage from "../model/ExceptionMessage";

class UserService {

    #users: User[] //temporary

    constructor() {
        this.#users = [];
    }

    getById(id: number): User | ExceptionMessage {
        const foundUser = this.#users.filter(u => u.id === id);
        if (foundUser.length) {
            return foundUser[0];
        } else {
            return new ExceptionMessage("User not found.");
        }
    }

    getByUsername(username: string): User | ExceptionMessage {
        const foundUser = this.#users.filter(u => u.username === username);
        if (foundUser.length) {
            return foundUser[0];
        } else {
            return new ExceptionMessage("User not found.");
        }
    }

    save(user: User) {
        user.id = this.#users.length + 1;
        this.#users.push(user);
    }

}

export default new UserService();