enum Rights {
    User,
    Admin,
    SuperAdmin,
}

export class User {
    id: number = 0;
    username: string = '';
    firstName: string = '';
    lastName: string = '';
    creationTime: Date = new Date();
    rights: Rights = 0;

    constructor(id: number, username: string, firstName: string, lastName: string, creationTime: Date, rights: Rights, public isBlocked?: boolean, public description ?: string) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.creationTime = creationTime;
        this.rights = rights;
    }
}
