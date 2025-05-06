import bcrypt from 'bcrypt';

export class HashService {
    static saltRounds:number = parseInt(process.env.SALT_ROUNDS);
    static password:string = process.env.HASH_PASSWORD;

    static async hashPassword(password:string):Promise<string> {
        const salt = await bcrypt.genSalt(HashService.saltRounds);
        const hash = await bcrypt.hash(password,salt);
        return hash;
    }

    static async checkPassword(data:string,encrypted:string) {
        return await bcrypt.compare(data,encrypted);
    }
}