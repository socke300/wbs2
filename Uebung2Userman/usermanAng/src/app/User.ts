export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  creationTime: Date;
  rights: Rights;
  description: string;
  blocked: boolean;

  constructor(id: number, username: string, firstname: string, lastName: string, creationTime: Date, description: string, rights: Rights) {
    this. id = id;
    this. username = username;
    this.firstName = firstname;
    this.lastName = lastName;
    this.creationTime = creationTime;
    this.rights = rights;
    this.description = description;
    this.blocked = false;
  }
}

export enum Rights{
  User,
  //Admin,
  //SuperAdmin
}
