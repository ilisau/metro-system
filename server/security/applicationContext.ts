import User from "../model/User";
import userService from "../service/userService";

class ApplicationContext {

    #principal?: User

    //TODO implement for every request its own session
    constructor() {
    }

    setPrincipal(id: number) {
        const user = userService.getById(id);
        if (user instanceof User) {
            this.#principal = user;
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