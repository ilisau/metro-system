import express from "express";
import userService from "../../../service/userService";
import ExceptionMessage from "../../../model/ExceptionMessage";
import {validateAuthorization, validatePrincipal} from "../../../security/permissionValidator";

export const router = express.Router();

router.get('/:id', validateAuthorization(), validatePrincipal(), async function (req, res, next) {
    const id = Number.parseInt(req.params.id);
    try {
        const user = await userService.getById(id);
        user.password = undefined;
        res.send(user);
    } catch (e: any) {
        res.status(404);
        res.send(new ExceptionMessage(e.message));
    }
});
