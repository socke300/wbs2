import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListComponent } from './list/list.component';
import { AddToListPageComponent } from './add-to-list-page/add-to-list-page.component';
import {RouterModule, Routes} from "@angular/router";
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import {HttpClientModule} from "@angular/common/http";
import { UserItemComponent } from './user-item/user-item.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import {SocketServiceService} from "./Services/socket-service.service";
import { AlertComponent } from './alert/alert.component';

const appRoutes: Routes = [
  {path: 'list', component: ListComponent},
  {path: 'addToList', component: AddToListPageComponent},
  {path: 'editModal/:id', component: ListComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    AddToListPageComponent,
    EditUserModalComponent,
    UserItemComponent,
    LoginComponent,
    LogoutComponent,
    AlertComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [SocketServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
