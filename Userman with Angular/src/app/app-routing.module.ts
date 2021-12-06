import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from './Sides/homepage/homepage.component';
import {AddUserPageComponent} from './Sides/add-user-page/add-user-page.component';
import {UserlistPageComponent} from './Sides/userlist-page/userlist-page.component';


const routes: Routes = [
  {path: '', redirectTo: 'userlist', pathMatch: 'prefix'},
  {path: 'userlist', component: HomepageComponent},
  {path: 'add', component: AddUserPageComponent},
  {path: 'list', component: UserlistPageComponent},
  {path: 'edit/:id', component: HomepageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [RouterModule]
})
export class AppRoutingModule {
}
