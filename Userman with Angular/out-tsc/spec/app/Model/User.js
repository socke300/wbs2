export class User {
  constructor(id, username, firstName, lastName, creationTime, rights, isBlocked, description) {
    this.isBlocked = isBlocked;
    this.description = description;
    this.id = 0;
    this.username = "";
    this.firstName = "";
    this.lastName = "";
    this.creationTime = new Date();
    this.rights = 0;
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.creationTime = creationTime;
    this.rights = rights;
  }
}

//# sourceMappingURL=User.js.map
