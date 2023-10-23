import express from "express";
import User from "../../model/User.js";
import authService from "../../service/authService.js";

export const router = express.Router();

router.post('/register', function (req: any, res, next) {
    const data: User = req.body;
    const exception = authService.register(data);
    if (exception) {
        res.status(400);
    } else {
        res.status(201);
    }
    res.send(exception);
});
