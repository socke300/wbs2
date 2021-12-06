import { Component } from '@angular/core';
import {AuthService} from "./Services/auth.service";
import {ClientDataService} from "./Services/client-data.service";
import {SocketServiceService} from "./Services/socket-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Userman';

  constructor(public authService: AuthService, public clientData: ClientDataService, public socketService: SocketServiceService) {

  }
}
