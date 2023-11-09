import express from "express";
import User from "../../model/User.js";
import authService from "../../service/authService";
import ExceptionMessage from "../../model/ExceptionMessage";
import {validateUser} from "../../security/requestValidators";


export const router = express.Router();

router.post('/register', validateUser(), async function (req: any, res, next) {
    try {
        const data: User = req.body;
        await authService.register(data);
        res.status(201);
        res.send();
    } catch (e: any) {
        res.status(400);
        res.send(new ExceptionMessage(e.message));
    }
});
