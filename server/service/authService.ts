import User from "../model/User";
import {LoginResponse} from "../model/LoginResponse";
import LoginRequest from "../model/LoginRequest";
import tokenService from "./tokenService";
import userService from "./userService";
import bcrypt from "bcrypt";

class AuthService {

    constructor() {
    }

    async login(request: LoginRequest): Promise<LoginResponse> {
        try {
            const foundUser = await userService.getByUsername(request.username);
            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(request.password, foundUser.password, (err: Error | undefined, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            if (!result) {
                throw new Error("Invalid credentials.");
            } else {
                const response = new LoginResponse(
                    await tokenService.accessToken(foundUser.username),
                    await tokenService.refreshToken(foundUser.username)
                );
                //TODO save tokens
                return response;
            }
        } catch (e: any) {
            throw new Error("Invalid credentials.");
        }
    }

    async register(user: User) {
        if (await userService.exists(user.username)) {
            throw new Error("User already exists.")
        }
        await userService.save(user);
    }

}

export default new AuthService();