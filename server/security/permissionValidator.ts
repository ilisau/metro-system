import applicationContext from "./applicationContext";
import ExceptionMessage from "../model/ExceptionMessage";

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
        if (applicationContext.principal?.id !== id) {
            const exception = new ExceptionMessage("Access denied.");
            res.status(403);
            res.send(exception);
        } else {
            next();
        }
    };
}
