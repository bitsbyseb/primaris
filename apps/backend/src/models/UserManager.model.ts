import { User, Admin, RegularUser } from './User.model.ts';
import type { FileModel } from './File.model.ts';

export class UserManager {
    private users: User[] = [];
    private files: FileModel[] = [];

    addUser(user: User): void {
        this.users.push(user);
    }

    addFile(file: FileModel, userId: string): void {
        this.files.push(file);
    }

    // Ejemplo de asociación entre usuarios y archivos
    getFilesByUser(userId: string): FileModel[] {
        return this.files.filter(file => file.userId === userId);
    }
}
