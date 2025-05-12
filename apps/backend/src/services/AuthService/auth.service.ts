import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
import { userLoginValidation, userValidation } from "../../validations/user.ts";
import * as boom from "@hapi/boom";
import { randomUUID } from "node:crypto";
import { HashService } from "../HashService/hash.service.ts";

const { MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } = process.env;

interface UserAttributes {
    id: string;
    username: string;
    password_hash: string;
    role: "user" | "admin";
    created_at: Date;
    updated_at: Date;
}

interface UserCreationAttributes
    extends
        Optional<UserAttributes, "id" | "role" | "created_at" | "updated_at"> {}

export interface PublicUserAttributes extends Omit<UserAttributes,'password_hash'> {}

const sequelize = new Sequelize("primaris", MYSQL_USER, MYSQL_PASSWORD, {
    host: "localhost",
    dialect: "mysql",
    port: parseInt(MYSQL_PORT),
    logging:false
});

class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    declare id: string;
    declare username: string;
    declare password_hash: string;
    declare role: "user" | "admin";
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

class Admin extends User {
    declare role:'admin';
}

User.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
    },
    created_at: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
});

await sequelize.sync(
    // { force: true },
);

function retrievePublicUserData(user:User):PublicUserAttributes {
    return {
        id:user.id,
        username:user.username,
        role:user.role,
        created_at:user.created_at,
        updated_at:user.updated_at
    }
}

export class AuthService {
    static async create(data: any): Promise<string> {
        const parsedData = userValidation.parse(data);
        const foundUser = await User.findOne({
            where: {
                username: parsedData.username,
            },
        });

        if (foundUser) {
            throw boom.conflict("username already exists");
        }
        const id = randomUUID();
        const password_hash = await HashService.hashPassword(
            parsedData.password,
        );

        await User.create({
            ...parsedData,
            id,
            password_hash,
        });

        return id;
    }

    static async findUser(data:Partial<User>):Promise<PublicUserAttributes | null> {
        const foundUser = await User.findOne({
            where:{
                ...data
            }
        });

        if (!foundUser) {
            return null;
        }

        return retrievePublicUserData(foundUser);
    }

    static async deleteUser(data:Partial<User>):Promise<boolean> {
        const foundUser = await User.findOne({
            where:{
                ...data
            }
        });

        if (!foundUser) {
            return false;
        }

        await foundUser.destroy();
        return true;
    }

    static async getAllUsers():Promise<PublicUserAttributes[]> {
        const users = await User.findAll({
            where:{
                role:"user"
            }
        });
        const publicDataUsers:PublicUserAttributes[] = users.map(user => {
            return retrievePublicUserData(user);
        });

        return publicDataUsers;
    }


    static async login(data: any):Promise<PublicUserAttributes> {
        const parsedData = userLoginValidation.parse(data);
        const foundUser = await User.findOne({
            where: {
                username: parsedData.username,
            },
        });

        if (!foundUser) {
            throw boom.notFound("username does not exists");
        }

        const hashedPassword = foundUser.get("password_hash") as string;
        const isValid = await HashService.checkPassword(
            parsedData.password,
            hashedPassword,
        );
        if (!isValid) throw boom.unauthorized("password is incorrect");
        return retrievePublicUserData(foundUser);
    }
}
