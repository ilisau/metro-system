class Claims {

    private claims: Map<String, Object>;

    constructor() {
        this.claims = new Map();
    }

    put(key: string, value: object) {
        this.claims.set(key, value);
    }

    get(key: string): undefined | Object {
        return this.claims.get(key);
    }

    delete(key: string) {
        this.claims.delete(key);
    }

}

export default Claims;