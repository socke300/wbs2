import {__decorate} from "tslib";
import {Component} from '@angular/core';

let LoginComponent = class LoginComponent {
  constructor(authService) {
    this.authService = authService;
    this.username = "";
    this.password = "";
  }

  ngOnInit() {
  }

  test() {
    console.log("Test");
  }
};
LoginComponent = __decorate([
  Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
], LoginComponent);
export {LoginComponent};
//# sourceMappingURL=login.component.js.map
