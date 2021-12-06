import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AddUserComponent} from './Components/add-user/add-user.component';
import {NotificationComponent} from './Components/notification/notification.component';
import {TestComponent} from './Components/test/test.component';
import {HomepageComponent} from './Sides/homepage/homepage.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UserListComponent} from './Components/user-list/user-list.component';
import {EditUserModalComponent} from './Components/edit-user-modal/edit-user-modal.component';
import {DeleteUserModalComponent} from './Components/delete-user-modal/delete-user-modal.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './Components/login/login.component';
import {LogoutComponent} from './Components/logout/logout.component';
import {AlertComponent} from './Components/alert/alert.component';
import { AddUserPageComponent } from './Sides/add-user-page/add-user-page.component';
import { UserlistPageComponent } from './Sides/userlist-page/userlist-page.component';


@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    NotificationComponent,
    TestComponent,
    HomepageComponent,
    UserListComponent,
    EditUserModalComponent,
    DeleteUserModalComponent,
    LoginComponent,
    LogoutComponent,
    AlertComponent,
    AddUserPageComponent,
    UserlistPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
