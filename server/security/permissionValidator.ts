import applicationContext from "./applicationContext";
import ExceptionMessage from "../model/ExceptionMessage";
import scheduleService from "../service/scheduleService";

export function validateAuthorization() {
    return (req: any, res: any, next: any) => {
        if (!applicationContext.authorized) {
            const exception = new ExceptionMessage("Not authorized.");
            res.status(401);
            res.send(exception);
        } else {
            next();
        }
    };
}

export function validatePrincipal() {
    return (req: any, res: any, next: any) => {
        const id = Number.parseInt(req.params.id);
        if (Number(applicationContext.principal?.id) !== id) {
            const exception = new ExceptionMessage("Access denied.");
            res.status(403);
            res.send(exception);
        } else {
            next();
        }
    };
}

export function validateScheduleAccess() {
    return (req: any, res: any, next: any) => {
        const id = Number.parseInt(req.params.id);
        const isAuthor = scheduleService.isAuthor(Number(applicationContext.principal?.id), id);
        if (!isAuthor) {
            const exception = new ExceptionMessage("Access denied.");
            res.status(403);
            res.send(exception);
        } else {
            next();
        }
    };
}
