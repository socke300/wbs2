import {__decorate} from "tslib";
import {Component} from '@angular/core';

let AppComponent = class AppComponent {
  constructor(authService, websocketsService, dataService) {
    this.authService = authService;
    this.websocketsService = websocketsService;
    this.dataService = dataService;
    this.title = 'Userman-with-Angular';
  }
};
AppComponent = __decorate([
  Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
], AppComponent);
export {AppComponent};
//# sourceMappingURL=app.component.js.map
