import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserlistComponent } from './userlist/userlist.component';
import { MainComponent } from './main/main.component';
import {HttpClientModule} from "@angular/common/http";
import { HeaderComponent } from './header/header.component';
import {FormsModule} from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SocketIoModule, SocketIoConfig} from "ngx-socket-io";
import { CreateUserComponent } from './create-user/create-user.component';
import { AlertComponent } from './alert/alert.component';
import { ListPageComponent } from './list-page/list-page.component';

const config: SocketIoConfig = {
  url: 'http://localhost:8080',
  options: {}
}

@NgModule({
  declarations: [
    AppComponent,
    UserlistComponent,
    MainComponent,
    HeaderComponent,
    CreateUserComponent,
    AlertComponent,
    ListPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
