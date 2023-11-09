import dotenv from "dotenv";

const crypto = require('crypto');

class JWT {

    private secret: string;

    constructor() {
        dotenv.config();
        this.secret = String(process.env.JWT_SECRET);
    }

    sign(payload: Object, expiration: number): string {
        const header = {alg: 'HS256', typ: 'JWT'};
        const headerBase64 = this.#encodeBase64URL(JSON.stringify(header));
        const payloadBase64 = this.#encodeBase64URL(JSON.stringify({
            ...payload,
            exp: Math.floor(Date.now() / 1000) + expiration
        }));
        const signature = this.#signData(headerBase64 + '.' + payloadBase64);
        return `${headerBase64}.${payloadBase64}.${signature}`;
    }

    decode(token: string): Object {
        const [headerBase64, payloadBase64, signature] = token.split('.');
        const payload = JSON.parse(this.#decodeBase64URL(payloadBase64));
        if (!this.isValid(token)) {
            throw new Error("Token is not valid.");
        }
        if (this.#signData(headerBase64 + '.' + payloadBase64) === signature) {
            return payload;
        } else {
            throw new Error('Token is not valid.');
        }
    }

    isValid(token: string): boolean {
        const [headerBase64, payloadBase64, signature] = token.split('.');
        const header = JSON.parse(this.#decodeBase64URL(headerBase64));
        const payload = JSON.parse(this.#decodeBase64URL(payloadBase64));
        if (header.alg !== 'HS256') {
            return false;
        }
        if (payload.exp < Date.now() / 1000) {
            return false;
        }
        return this.#signData(headerBase64 + '.' + payloadBase64) === signature;

    }

    #encodeBase64URL(data: string): string {
        return Buffer.from(data, 'utf8').toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    #decodeBase64URL(base64URL: string): string {
        while (base64URL.length % 4) {
            base64URL += '=';
        }
        return Buffer.from(base64URL, 'base64').toString('utf8');
    }

    #signData(data: string): string {
        return crypto.createHmac('sha256', this.secret).update(data).digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }
}

export default new JWT();