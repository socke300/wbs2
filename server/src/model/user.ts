import {Rights} from "./rights";
import {ObjectId} from "mongodb";

export class User {
    public _id: ObjectId;
    public username: string;
    public firstName: string;
    public lastName: string;
    public creationTime: Date;
    public rights: Rights;
    public password: string | null;

    constructor(_id: ObjectId, username: string, firstName: string, lastName: string, creationTime: Date, rights: Rights) {
        this._id = _id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.creationTime = creationTime;
        this.rights = rights;
    }
}
