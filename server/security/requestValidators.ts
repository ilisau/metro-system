import ExceptionMessage from "../model/ExceptionMessage";
import User from "../model/User";
import LoginRequest from "../model/LoginRequest";
import {ScheduleRequest} from "../model/ScheduleRequest";

function isEmail(email: string) {
    const exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    return exp.test(email);
}

function isMeasurementTime(time: string) {
    const exp = /^[0-9]{1,2}:+[0-9]{2}/g;
    return exp.test(time);
}

export function validateLoginRequest() {
    return (req: any, res: any, next: any) => {
        const request: LoginRequest = req.body;
        let errors = [];
        if (!('username' in request) || !isEmail(request.username)) {
            errors.push('Incorrect username.');
        }
        if (!('password' in request) || request.password!.length === 0) {
            errors.push('Password must be not empty.');
        }
        if (errors.length) {
            const exception = new ExceptionMessage("Validation failed");
            exception.errors = errors;
            res.status(400);
            res.send(exception);
        } else {
            next();
        }
    };
}

export function validateUser() {
    return (req: any, res: any, next: any) => {
        const user: User = req.body;
        let errors = [];
        if ('id' in user) {
            user.id = undefined
        }
        if (!('name' in user) || user.name.length === 0) {
            errors.push('Name is required.');
        }
        if (!('username' in user) || !isEmail(user.username)) {
            errors.push('Incorrect username.');
        }
        if (!('password' in user) || user.password!.length < 8) {
            errors.push('Password must be longer than 8 characters.');
        }
        if (errors.length) {
            const exception = new ExceptionMessage("Validation failed");
            exception.errors = errors;
            res.status(400);
            res.send(exception);
        } else {
            next();
        }
    };
}

export function validateScheduleRequest() {
    return (req: any, res: any, next: any) => {
        const request: ScheduleRequest = req.body;
        let errors = [];
        if ('id' in request) {
            request.id = undefined
        }
        if (!('trains' in request) || request.trains <= 0) {
            errors.push('Trains amount must be above 0.');
        }
        if (!('capacity' in request) || request.capacity <= 0) {
            errors.push('Capacity must be above 0.');
        }
        if ('accuracy' in request && (request.accuracy > 60 || request.accuracy <= 0)) {
            errors.push('Accuracy must be less than 60.');
        }
        if ('fullness' in request && (request.fullness <= 0 || request.fullness > 1)) {
            errors.push('Fullness must be in (0, 1].');
        }
        if ('flow' in request) {
            if (request.flow.length < 1) {
                errors.push('Flow must contain more than 1 measurements.');
            }
            for (let measurement of request.flow) {
                if (measurement.amount <= 0) {
                    errors.push(`Measurement ${JSON.stringify(measurement)} amount must be positive.`);
                    break;
                }
                if (!isMeasurementTime(measurement.time)) {
                    errors.push(`Measurement time ${JSON.stringify(measurement)} is not correct.`);
                    break;
                }
            }
        } else {
            errors.push('Flow must contain more than 1 measurements.');
        }
        if (errors.length) {
            const exception = new ExceptionMessage("Validation failed");
            exception.errors = errors;
            res.status(400);
            res.send(exception);
        } else {
            next();
        }
    };
}
