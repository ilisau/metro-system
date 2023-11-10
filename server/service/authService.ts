import User from "../model/User";
import LoginResponse from "../model/LoginResponse";
import LoginRequest from "../model/LoginRequest";
import tokenService from "./tokenService";
import userService from "./userService";
import bcrypt from "bcrypt";
import tokenRepository from "../repository/tokenRepository";

class AuthService {

    async login(request: LoginRequest): Promise<LoginResponse> {
        //TODO get tokens from redis
        try {
            const foundUser = await userService.getByUsername(request.username);
            const result = await new Promise((resolve, reject) => {
                console.log(request.password, foundUser.password!)
                bcrypt.compare(request.password, foundUser.password!, (err: Error | undefined, result) => {
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
                await tokenRepository.save(foundUser.id!, response);
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

    //TODO validate whether it is refresh token
    async refresh(token: string): Promise<LoginResponse> {
        if (tokenService.isValid(token)) {
            const userId: number = <number>tokenService.parseClaims(token).get("userId");
            const foundUser = await userService.getById(userId);
            const response = new LoginResponse(
                await tokenService.accessToken(foundUser.username),
                await tokenService.refreshToken(foundUser.username)
            );
            await tokenRepository.save(foundUser.id!, response);
            return response;
        } else {
            throw new Error("Invalid token.");
        }
    }

}

export default new AuthService();