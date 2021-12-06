import {__decorate} from "tslib";
import {Injectable} from '@angular/core';

let AlertService = class AlertService {
  constructor() {
    this.alertList = [];
  }

  deleteAutomatic(index) {
    setTimeout(() => {
      this.alertList.splice(index, 1);
    }, 5000);
  }

  add(text) {
    this.alertList.push(text);
    this.deleteAutomatic(this.alertList.length - 1);
  }

  delete(index) {
    this.alertList.splice(index, 1);
  }
};
AlertService = __decorate([
  Injectable({
    providedIn: 'root'
  })
], AlertService);
export {AlertService};
//# sourceMappingURL=alert.service.js.map
