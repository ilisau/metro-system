import express from "express";
import userService from "../../../service/userService";
import ExceptionMessage from "../../../model/ExceptionMessage";

export const router = express.Router();

router.get('/:id', function (req, res, next) {
    const user = userService.getById(Number.parseInt(req.params.id));
    if (user instanceof ExceptionMessage) {
        res.status(404);
    }
    res.send(user);
});
