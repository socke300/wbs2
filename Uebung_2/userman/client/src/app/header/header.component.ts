import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faComment = faComment
  username: string;
  password: string;
  @Output() errorEvent: EventEmitter<HttpErrorResponse>;

  constructor(public authService: AuthService) {
    this.errorEvent = new EventEmitter<HttpErrorResponse>();
    this.username = '';
    this.password = '';
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin() {
    this.authService.checkLogin().catch((err: any) => {
      this.errorEvent.emit(err);
    });
  }

  login(username: string, password: string){
    if (username && password) {
      this.authService.login(username, password).catch((err: any) => {
      this.errorEvent.emit(err);
    });
    }
  }

  logout(){
    this.authService.logout().catch((err: any) => {
      this.errorEvent.emit(err);
    })
  }
}
