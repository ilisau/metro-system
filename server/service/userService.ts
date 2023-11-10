import User from "../model/User";
import {userRepository} from "../repository/userRepository";
import bcrypt from 'bcrypt';
import * as util from "util";

class UserService {

    async getById(id: number): Promise<User> {
        return userRepository.getById(id);
    }

    async getByUsername(username: string): Promise<User> {
        return userRepository.getByUsername(username);
    }

    async exists(username: string): Promise<boolean> {
        return userRepository.exists(username);
    }

    async save(user: User) {
        user.password = await util.promisify(bcrypt.hash)(user.password!, 10);
        await userRepository.save(user);
    }

}

export default new UserService();