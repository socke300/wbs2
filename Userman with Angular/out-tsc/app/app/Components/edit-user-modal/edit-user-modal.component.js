import {__decorate} from "tslib";
import {Component} from '@angular/core';

let EditUserModalComponent = class EditUserModalComponent {
  constructor(activeModal) {
    this.activeModal = activeModal;
    this.firstname = "";
    this.lastname = "";
    this.username = "";
  }

  ngOnInit() {
  }

  save() {
    if (this.lastname.trim().length > 0 && this.firstname.trim().length > 0) {
      this.activeModal.close([this.firstname, this.lastname]);
    }
  }
};
EditUserModalComponent = __decorate([
  Component({
    selector: 'app-edit-user-modal',
    templateUrl: './edit-user-modal.component.html',
    styleUrls: ['./edit-user-modal.component.css']
  })
], EditUserModalComponent);
export {EditUserModalComponent};
//# sourceMappingURL=edit-user-modal.component.js.map
