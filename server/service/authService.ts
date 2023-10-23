import User from "../model/User";
import {LoginResponse} from "../model/LoginResponse";
import ExceptionMessage from "../model/ExceptionMessage";
import LoginRequest from "../model/LoginRequest";
import tokenService from "./tokenService";
import userService from "./userService";

class AuthService {

    constructor() {
    }

    login(request: LoginRequest): LoginResponse | ExceptionMessage {
        const foundUser = userService.getByUsername(request.username);
        if (foundUser instanceof User) {
            //TODO compare with password
            const response = new LoginResponse(
                tokenService.accessToken(foundUser.username),
                tokenService.refreshToken(foundUser.username)
            );
            return response;
        } else {
            return foundUser;
        }
    }

    register(user: User): undefined | ExceptionMessage {
        const foundUser = userService.getByUsername(user.username);
        if (foundUser instanceof User) {
            return new ExceptionMessage("User already exists.")
        } else {
            userService.save(user);
        }
    }

}

export default new AuthService();