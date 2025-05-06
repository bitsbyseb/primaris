import type { MiddlewareHandler} from "hono";
import { getCookie } from "hono/cookie";
import * as boom from '@hapi/boom';
import jwt from 'jsonwebtoken';

export type AccessPayload = jwt.JwtPayload & {
    id:string,
    username:string,
    admin: boolean
}

export const validateToken = <T extends jwt.JwtPayload>(token:string):T | null => {
    try {
        const payload = jwt.verify(token,process.env.JSON_WEB_TOKEN_SECRET) as T;
        return payload;
    } catch {
        return null;
    }
}

export const token: MiddlewareHandler = async (c, next) => {
    const token = getCookie(c,'access_token');
    
    if (!token) {
        throw boom.unauthorized("Access not authorized")
    }

    const data = jwt.verify(token,process.env.JSON_WEB_TOKEN_SECRET);
    c.set("session",data);
    await next();
};

export const verifyAdmin:MiddlewareHandler = async (c,next) => {
    const token = getCookie(c,'access_token');
    
    if (!token) {
        throw boom.unauthorized("Access not authorized")
    }

    const decoded = jwt.verify(token,process.env.JSON_WEB_TOKEN_SECRET) as AccessPayload;

    if (!decoded || !decoded.admin) {
        throw boom.unauthorized("not enough permissions");
    }

    c.set('session',decoded);
    await next();
}