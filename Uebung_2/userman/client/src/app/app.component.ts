import {Component, TemplateRef, ViewChild} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "./models/user.model";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
constructor(public authService: AuthService) {
}

  error: string = '';


  processErrorEvent(err: HttpErrorResponse){
    if (err.status === 401){
      this.authService.logout();
    }
    this.error = err.error.message;
    setTimeout(() => {
      this.error = "";
    }, 5000)
  }
}
