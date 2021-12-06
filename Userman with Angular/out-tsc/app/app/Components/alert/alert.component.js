import {__decorate} from "tslib";
import {Component} from '@angular/core';

let AlertComponent = class AlertComponent {
  constructor(alertService) {
    this.alertService = alertService;
    this.text = "";
  }

  ngOnInit() {
  }
};
AlertComponent = __decorate([
  Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
  })
], AlertComponent);
export {AlertComponent};
//# sourceMappingURL=alert.component.js.map
