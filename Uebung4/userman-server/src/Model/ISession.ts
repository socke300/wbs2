import {User} from "./user";


export interface ISession {
    user: User | null;
}