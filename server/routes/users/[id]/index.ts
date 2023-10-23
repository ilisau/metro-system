import express from "express";
import userService from "../../../service/userService";
import ExceptionMessage from "../../../model/ExceptionMessage";
import {validateAuthorization, validatePrincipal} from "../../../security/permissionValidator";

export const router = express.Router();

router.get('/:id', validateAuthorization(), validatePrincipal(), function (req, res, next) {
    const id = Number.parseInt(req.params.id);
    const user = userService.getById(id);
    if (user instanceof ExceptionMessage) {
        res.status(404);
    }
    res.send(user);
});
