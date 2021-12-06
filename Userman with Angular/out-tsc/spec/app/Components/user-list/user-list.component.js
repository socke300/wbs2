import {__awaiter, __decorate} from "tslib";
import {Component} from '@angular/core';
import {EditUserModalComponent} from "../edit-user-modal/edit-user-modal.component";
import {DeleteUserModalComponent} from "../delete-user-modal/delete-user-modal.component";

let UserListComponent = class UserListComponent {
  constructor(dataService, ngbModal, location, route, websocketsService) {
    this.dataService = dataService;
    this.ngbModal = ngbModal;
    this.location = location;
    this.route = route;
    this.websocketsService = websocketsService;
    this.editPath = "/edit/";
    this.normalPath = "/userlist";
    route.params.subscribe(params => {
      if (location.path().includes(this.editPath))
        this.editBtn(params.id);
    });
  }

  ngOnInit() {
  }

  editBtn(id) {
    return __awaiter(this, void 0, void 0, function* () {
      this.location.go(this.editPath + id);
      this.websocketsService.blockUser(id);
      const user = yield this.dataService.getUserByID(id);
      const modalReference = this.ngbModal.open(EditUserModalComponent);
      modalReference.componentInstance.firstname = user.firstName;
      modalReference.componentInstance.lastname = user.lastName;
      modalReference.componentInstance.username = user.username;
      try {
        const result = yield modalReference.result;
        yield this.dataService.editUser(result[0], result[1], id);
      } catch (e) {
        console.log("editBtn closed: " + e);
      }
      this.location.go(this.normalPath);
      this.websocketsService.unblockUser(id);
    });
  }

  deleteBtn(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const modalReference = this.ngbModal.open(DeleteUserModalComponent);
      modalReference.componentInstance.username = (yield this.dataService.getUserByID(id)).username;
      this.websocketsService.blockUser(id);
      try {
        yield modalReference.result;
        yield this.dataService.deleteUser(id);
      } catch (e) {
        console.log("deleteBtn closed: " + e);
      }
      this.websocketsService.unblockUser(id);
    });
  }
};
UserListComponent = __decorate([
  Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
  })
], UserListComponent);
export {UserListComponent};
//# sourceMappingURL=user-list.component.js.map
