import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {UserDetailComponent} from './components/user-detail/user-detail.component';
import {AlertsComponent} from './components/alerts/alerts.component';
import {AddUserComponent} from './components/add-user/add-user.component';
import {UsersComponent} from './components/users/users.component';
import {MainComponent} from './components/main/main.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {UpdateUserComponent} from './components/update-user/update-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/userspage', pathMatch: 'full' },
  { path: 'userspage', component: UsersComponent},
  { path: 'addpage', component: AddUserComponent},
  { path: 'editpage/user/:id', component: UsersComponent}
];

@NgModule({
  declarations: [
    MainComponent,
    UsersComponent,
    AddUserComponent,
    AlertsComponent,
    UserDetailComponent,
    UpdateUserComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  entryComponents: [UpdateUserComponent],
  bootstrap: [MainComponent]
})
export class AppModule { }
