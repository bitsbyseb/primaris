import {z} from 'zod';
import { maxPasswordLength, maxUsernameLength, minPasswordLength, minUsernameLength, userRoles } from '../constants.ts';

export const userValidation = z.object({
    username:z.string()
            .min(minUsernameLength,`username must be at least ${minUsernameLength} characters long or fewer`)
            .max(maxUsernameLength,`username can't be less than ${maxUsernameLength} characters long`),

    password:z.string()
            .max(maxPasswordLength,`password must be at least ${maxPasswordLength} characters length or fewer`)
            .min(minPasswordLength,`password can't less than ${minPasswordLength} long`),

    role:z.literal("user",{invalid_type_error:"role must be a string"}).default("user")
});


export const userLoginValidation = userValidation.omit({role:true});