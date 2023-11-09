import User from "../model/User";
import {userRepository} from "../repository/userRepository";
import bcrypt from 'bcrypt';

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
        bcrypt.hash(user.password!, 10, async function (err: Error | undefined, hash: string) {
            user.password = hash;
            await userRepository.save(user);
        });
    }

}

export default new UserService();