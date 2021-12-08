import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DoneListComponent} from "./done-list/done-list.component";
import {ListComponent} from "./list/list.component";

const routes: Routes = [
  {path: 'add', component: ListComponent},
  {path: 'doneList', component: DoneListComponent},
  {path: '', component: ListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
