import {__decorate} from "tslib";
import {Component} from '@angular/core';
import {User} from "../../Model/User";

let AddUserComponent = class AddUserComponent {
  constructor(dataService) {
    this.dataService = dataService;
    this.user = new User(0, "", "", "", new Date(), 0, false);
    this.password = "";
    this.description = "";
  }

  ngOnInit() {
  }

  addUser() {
    if (this.user.lastName.trim().length > 0 && this.user.firstName.trim().length > 0 &&
      this.user.username.trim().length > 0 && this.password.trim().length > 0)
      this.dataService.addUser(this.user, this.password, this.description);
  }
};
AddUserComponent = __decorate([
  Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
  })
], AddUserComponent);
export {AddUserComponent};
//# sourceMappingURL=add-user.component.js.map
