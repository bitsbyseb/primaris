export class User {
    id: string;
    username: string;
    password: string;
    role: string;

    constructor(username: string, password: string, role: string = 'user') {
        this.id = crypto.randomUUID();
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

export class Admin extends User {
    canManageUsers: boolean;

    constructor(username: string, password: string) {
        super(username, password, 'admin');
        this.canManageUsers = true;
    }
}

export class RegularUser extends User {
    storageLimit: number;

    constructor(username: string, password: string) {
        super(username, password, 'user');
        this.storageLimit = 5000; // 5GB
    }
}
