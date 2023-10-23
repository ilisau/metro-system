import express from "express";
import authService from "../../service/authService.js";
import LoginRequest from "../../model/LoginRequest";
import ExceptionMessage from "../../model/ExceptionMessage";

export const router = express.Router();

router.post('/login', async function (req: any, res, next) {
    const data: LoginRequest = req.body;
    try {
        const loginResponse = await authService.login(data);
        res.send(loginResponse);
    } catch (e: any) {
        res.status(404);
        res.send(new ExceptionMessage(e.message));
    }
});
