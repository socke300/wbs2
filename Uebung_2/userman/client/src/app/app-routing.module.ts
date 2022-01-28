import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {UserlistComponent} from "./userlist/userlist.component";

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'user/:id', component: MainComponent},
  {path: 'list', component: UserlistComponent},
  {path: 'add', component: CreateUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
