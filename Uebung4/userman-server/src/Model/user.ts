import {Rights} from "./rights";

export class User {
    public id: number;
    public username: string;
    public firstName: string;
    public lastName: string;
    public password: string;
    public creationTime: Date;
    public rights: Rights;

    constructor(id: number, username: string, firstName: string, lastName: string, password: string, creationTime: Date, rights: Rights) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.creationTime = creationTime;
        this.rights = rights;
    }
}
