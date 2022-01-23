import {Component} from '@angular/core';
import {AuthService} from './Service/auth.service';
import {WebsocketsService} from './Service/websockets.service';
import {DataService} from './Service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Userman-with-Angular';

  constructor(
    public authService: AuthService,
    public websocketsService: WebsocketsService,
    public dataService: DataService,
  ) {
  }
}
