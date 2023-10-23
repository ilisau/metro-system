import express from "express";
import authService from "../../service/authService.js";
import LoginRequest from "../../model/LoginRequest";
import ExceptionMessage from "../../model/ExceptionMessage";

export const router = express.Router();

router.post('/login', function (req: any, res, next) {
    const data: LoginRequest = req.body;
    const loginResponse = authService.login(data);
    if (loginResponse instanceof ExceptionMessage) {
        res.status(404);
    }
    res.send(loginResponse);
});
