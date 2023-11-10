export default class User {

    id: number | undefined;
    name: string;
    username: string;
    password: string | undefined;

    constructor(id: number | undefined, name: string, username: string, password: string) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
    }

}