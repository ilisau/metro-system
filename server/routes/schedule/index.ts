import express from "express";
import scheduleService from "../../service/scheduleService"
import {ScheduleRequest} from "../../model/ScheduleRequest";
import {validateAuthorization} from "../../security/permissionValidator";
import applicationContext from "../../security/applicationContext";
import {validateScheduleRequest} from "../../security/requestValidators";

export const router = express.Router();

router.post('/', validateAuthorization(), validateScheduleRequest(), async function (req: any, res, next) {
    const data: ScheduleRequest = req.body;
    data.authorId = applicationContext.principal?.id!;
    const response = await scheduleService.create(data);
    res.status(201);
    res.send(response);
});
