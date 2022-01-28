// Interface representing a user
import {Rights} from "./right.model";

export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  creationTime: Date;
  rights: Rights;

  constructor(id: number, username: string, firstName: string, lastName: string, creationTime: Date, rights: Rights) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.creationTime = creationTime;
    this.rights = rights;
  }
}
