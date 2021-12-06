import {__decorate} from "tslib";
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomepageComponent} from "./Sides/homepage/homepage.component";

const routes = [
  {path: '', redirectTo: 'userlist', pathMatch: 'prefix'},
  {path: 'userlist', component: HomepageComponent},
  {path: 'edit/:id', component: HomepageComponent},
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
  NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
  })
], AppRoutingModule);
export {AppRoutingModule};
//# sourceMappingURL=app-routing.module.js.map
