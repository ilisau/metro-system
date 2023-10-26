import express from "express";
import ExceptionMessage from "../../../model/ExceptionMessage";
import {validateAuthorization, validateScheduleAccess} from "../../../security/permissionValidator";
import scheduleService from "../../../service/scheduleService";

export const router = express.Router();

router.get('/:id', validateAuthorization(), validateScheduleAccess(), async function (req, res, next) {
    const id = Number.parseInt(req.params.id);
    try {
        const schedule = await scheduleService.getById(id);
        res.send(schedule);
    } catch (e: any) {
        res.status(404);
        res.send(new ExceptionMessage(e.message));
    }
});
