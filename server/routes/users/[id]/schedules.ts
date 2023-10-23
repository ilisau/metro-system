import express from "express";
import scheduleService from "../../../service/scheduleService";
import {validateAuthorization, validatePrincipal} from "../../../security/permissionValidator";

export const router = express.Router();

router.get('/:id/schedules', validateAuthorization(), validatePrincipal(), async function (req, res, next) {
    const id = Number.parseInt(req.params.id);
    const schedules = await scheduleService.getAllByAuthorId(id);
    res.send(schedules);
});
