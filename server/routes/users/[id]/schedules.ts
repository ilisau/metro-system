import express from "express";
import scheduleService from "../../../service/scheduleService";

export const router = express.Router();

router.get('/:id/schedules', function (req, res, next) {
    const schedules = scheduleService.getAllByAuthorId(Number.parseInt(req.params.id));
    res.send(schedules);
});
