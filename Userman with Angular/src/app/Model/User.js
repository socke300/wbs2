"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(id, username, firstName, lastName, creationTime, rights, isBlocked, description) {
        this.isBlocked = isBlocked;
        this.description = description;
        this.id = 0;
        this.username = '';
        this.firstName = '';
        this.lastName = '';
        this.creationTime = new Date();
        this.rights = 0;
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.creationTime = creationTime;
        this.rights = rights;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map