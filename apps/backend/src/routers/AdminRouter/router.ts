import { verifyAdmin,token } from "../../middlewares/token.ts";
import { AuthService, type PublicUserAttributes } from "../../services/AuthService/auth.service.ts";
import { Hono } from "hono";
import * as boom from '@hapi/boom';


const app = new Hono();
app.use("*",token,verifyAdmin);


app.get('/users',async (c) => {
    const users = await AuthService.getAllUsers();
    return c.json(users,200);
});

app.delete('/user',async (c) => {
    const userData:Partial<PublicUserAttributes | undefined> = await c.req.json();
    if (!userData) {
        throw boom.badData("user data is missing");
    }
    const foundUser = await AuthService.findUser(userData);

    if (!foundUser) {
        throw boom.notFound("the user does not exists");
    }

    const deletingUser = await AuthService.deleteUser(userData);

    if (!deletingUser) {
        throw boom.internal("the resource couldn't be deleted");
    }

    return c.json(foundUser,200);
});

export {app as AdminRouter};