import { Hono } from 'hono';
import { AuthService } from '../../services/AuthService/auth.service.ts';
import jwt from 'jsonwebtoken';
import { getCookie, setCookie,deleteCookie } from 'hono/cookie';
import { token,validateToken } from "../../middlewares/token.ts";
import * as boom from '@hapi/boom';

const app = new Hono();

app.post('/register',async (c) => {
    const body = await c.req.json();
    const id = await AuthService.create(body);
    return c.json({
        id,
    },201)
});

app.post('/login',async (c) => {
    const body = await c.req.json();
    const user = await AuthService.login(body);
    

    const refreshToken = jwt.sign({
        sub:user.id,
        iss:"primaris",
    },process.env.JSON_WEB_TOKEN_SECRET,{
        expiresIn:"7d"
    })
    
    const accessToken = jwt.sign({
        id:user.id,
        username:user.username,
        admin: user.role === 'admin'
    },
    process.env.JSON_WEB_TOKEN_SECRET,
    {
        expiresIn:'1h'    
    });
    
    setCookie(c,"access_token",accessToken,{
        httpOnly:true, // this cookie can only be read by from the server
        // secure: true
        // sameSite:true
        maxAge:1000 * 60 * 60
    });

    setCookie(c,"refresh_token",refreshToken,{
        httpOnly:true
    });
    return c.json(user,200);
});

app.post('/logout',token,async (c) => {
    deleteCookie(c,'access_token');
    deleteCookie(c,'refresh_token');
    return c.json({message:"logout successful"},200)
});


app.post('/refresh',async (c) => {
    const refreshToken = getCookie(c,'refresh_token');
    if (!refreshToken) {
        throw boom.unauthorized("no refresh token sended");
    }
    const decoded = validateToken(refreshToken);
    if (!decoded) {
        throw boom.unauthorized("your token is invalid or expired");
    }

    const userId = decoded.sub;
    
    if (!userId) {
        throw boom.conflict("undefined user id");
    }

    const foundUser = await AuthService.findUser({
        id:userId
    });

    if (!foundUser) {
        throw boom.unauthorized("Your username does not exists");
    }

    const newAccessToken = jwt.sign({
        id:foundUser.id,
        username:foundUser.username,
        admin: foundUser.role === 'admin'
    },process.env.JSON_WEB_TOKEN_SECRET,{
        expiresIn:'1h'
    });

    setCookie(c,"access_token",newAccessToken,{
        httpOnly:true,
        maxAge:1000 * 60 * 60
    });
    return c.json(foundUser,202);
});

// app.get('/protected',async (c) => {
//     const data = c.get("session" as never) as string;
//     return c.json(data,201);
// });

export {app as AuthRouter};