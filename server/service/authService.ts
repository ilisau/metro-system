import User from "../model/User";
import LoginResponse from "../model/LoginResponse";
import LoginRequest from "../model/LoginRequest";
import tokenService from "./tokenService";
import userService from "./userService";
import bcrypt from "bcrypt";
import util from "util";
import {tokenRepository} from "../repository/tokenRepository";

class AuthService {

    async login(request: LoginRequest): Promise<LoginResponse> {
        try {
            const foundUser = await userService.getByUsername(request.username);
            const result = await util.promisify(bcrypt.compare)(request.password, foundUser.password!);
            if (!result) {
                throw new Error("Invalid credentials.");
            }
            const response = new LoginResponse(
                await tokenService.accessToken(foundUser.username),
                await tokenService.refreshToken(foundUser.username)
            );
            await tokenRepository.save(foundUser.id!, response);
            return response;
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

    async refresh(token: string): Promise<LoginResponse> {
        if (tokenService.isValid(token) && tokenService.parseClaims(token).get("type") === "REFRESH") {
            const userId: number = <number>tokenService.parseClaims(token).get("sub");
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