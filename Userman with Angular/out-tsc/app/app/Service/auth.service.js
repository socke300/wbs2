import {__awaiter, __decorate} from "tslib";
import {Injectable} from '@angular/core';

let AuthService = class AuthService {
  constructor(httpClient, dataService) {
    this.httpClient = httpClient;
    this.dataService = dataService;
    this.isLogin = false;
    this.userName = "";
    this.checkLogin().then();
  }

  checkLogin() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const res = yield this.httpClient.get('http://localhost:8080/login').toPromise();
        this.dataService.getUserList().then();
        this.isLogin = true;
        this.userName = res.user.username;
      } catch (e) {
        console.log("Check Login Error: " + e.error.message);
        this.isLogin = false;
      }
    });
  }

  login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.httpClient.post('http://localhost:8080/login', {
          username: username,
          password: password
        }).toPromise();
        this.isLogin = true;
        this.userName = username;
        this.dataService.getUserList().then();
      } catch (e) {
        console.log("Login Error: " + e);
        this.isLogin = false;
      }
    });
  }

  logout() {
    this.httpClient.post('http://localhost:8080/logout', {}).toPromise();
    this.userName = "";
    this.dataService.userList = [];
    this.isLogin = false;
  }
};
AuthService = __decorate([
  Injectable({
    providedIn: 'root'
  })
], AuthService);
export {AuthService};
//# sourceMappingURL=auth.service.js.map
