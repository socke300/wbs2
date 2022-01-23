import {__awaiter, __decorate} from "tslib";
import {Injectable} from '@angular/core';

let DataService = class DataService {
  constructor(httpClient, alertService) {
    this.httpClient = httpClient;
    this.alertService = alertService;
    this.userList = [];
  }

  getUserList() {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield this.httpClient.get('http://localhost:8080/users').toPromise();
      this.userList = res.userList;
    });
  }

  getUserByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.getUserList();
      return this.userList.find(item => item.id == id);
    });
  }

  editUser(firstName, lastName, id) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.httpClient.put('http://localhost:8080/user/' + id, {
        firstName: firstName,
        lastName: lastName
      }).toPromise();
      this.getUserList().then();
    });
  }

  deleteUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.httpClient.delete('http://localhost:8080/user/' + userID, {}).toPromise();
        this.getUserList().then();
        this.alertService.add('User deleted!');
      } catch (e) {
        this.alertService.add("User cannot be deleted!");
      }
    });
  }

  addUser(user, password, description) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.httpClient.post('http://localhost:8080/user', {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          password: password,
          description: description
        }).toPromise();
        this.getUserList().then();
        this.alertService.add('User "' + user.username + '" created!');
      } catch (e) {
        this.alertService.add("User cannot be created!");
      }
    });
  }
};
DataService = __decorate([
  Injectable({
    providedIn: 'root'
  })
], DataService);
export {DataService};
//# sourceMappingURL=data.service.js.map
