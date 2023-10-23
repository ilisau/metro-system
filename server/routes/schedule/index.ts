import express from "express";
import scheduleService from "../../service/scheduleService"
import {ScheduleRequest} from "../../model/ScheduleRequest";

export const router = express.Router();

router.post('/', function (req: any, res, next) {
    const data: ScheduleRequest = req.body;
    //TODO set author
    const response = scheduleService.create(data);
    res.status(201);
    res.send(response);
});
