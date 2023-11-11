import tokenService from "../service/tokenService";
import applicationContext from "./applicationContext";

const authMiddleware = async (req: any, res: any, next: any) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1];
        if (tokenService.isValid(token)) {
            const claims = tokenService.parseClaims(token);
            const userId = <number>claims.get("sub");
            await applicationContext.setPrincipal(userId);
        }
    }
    next();
};

export default authMiddleware;