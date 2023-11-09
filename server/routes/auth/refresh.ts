import express from "express";
import authService from "../../service/authService";
import ExceptionMessage from "../../model/ExceptionMessage";


export const router = express.Router();

router.post('/refresh', async function (req: any, res, next) {
    try {
        const token = req.body;
        const data = await authService.refresh(token.token);
        res.status(201);
        res.send(data);
    } catch (e: any) {
        res.status(400);
        res.send(new ExceptionMessage(e.message));
    }
});
