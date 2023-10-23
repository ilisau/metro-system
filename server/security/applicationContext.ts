import User from "../model/User";
import userService from "../service/userService";

class ApplicationContext {

    #principal?: User

    //TODO implement for every request its own session
    constructor() {
    }

    async setPrincipal(id: number) {
        try {
            this.#principal = await userService.getById(id);
        } catch (e: any) {
            this.#principal = undefined;
        }
    }

    get principal(): undefined | User {
        return this.#principal;
    }

    get authorized(): boolean {
        return this.#principal !== undefined;
    }

}

export default new ApplicationContext();