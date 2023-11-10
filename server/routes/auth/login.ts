import express from "express";
import authService from "../../service/authService";
import LoginRequest from "../../model/LoginRequest";
import ExceptionMessage from "../../model/ExceptionMessage";
import {validateLoginRequest} from "../../security/requestValidators";

export const router = express.Router();

router.post('/login', validateLoginRequest(), async function (req: any, res, next) {
    const data: LoginRequest = req.body;
    try {
        const loginResponse = await authService.login(data);
        res.send(loginResponse);
    } catch (e: any) {
        res.status(400);
        res.send(new ExceptionMessage(e.message));
    }
});
