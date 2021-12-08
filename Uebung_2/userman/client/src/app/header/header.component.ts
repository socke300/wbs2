import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import {DataService} from "../data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faComment = faComment
  loggedIn: any = undefined;
  username;
  password;
  @Input() logoutRequest: boolean = false;
  @Output() loggedInEvent: EventEmitter<boolean>;
  @Output() errorEvent: EventEmitter<HttpErrorResponse>;
  @Output() pageSwapEvent: EventEmitter<number>;

  constructor(private dataService: DataService) {
    this.pageSwapEvent = new EventEmitter<number>();
    this.loggedInEvent = new EventEmitter<boolean>();
    this.errorEvent = new EventEmitter<HttpErrorResponse>();
    this.username = '';
    this.password = '';
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin() {
    this.dataService.checkLogin().then((res: any) => {
      this.loggedIn = res.user;
      this.loggedInEvent.emit(res.user);
    }).catch((err: any) => {
      this.errorEvent.emit(err);
    });
  }

  login(username: string, password: string){
    if (username && password) {
      this.dataService.login(username, password).then((res: any) => {
        this.loggedIn = res.user;
        this.loggedInEvent.emit(res.user);
      }).catch((err: any) => {
      this.errorEvent.emit(err);
    });
    }
  }

  logout(){
    this.dataService.logout().then(() => {
      this.loggedIn = undefined;
      this.loggedInEvent.emit(undefined);
    }).catch((err: any) => {
      this.errorEvent.emit(err);
    })
  }

  ngOnChanges(changes: SimpleChanges){
    for (const propName in changes){
      if (propName === 'logoutRequest' && changes[propName].currentValue === true){
        this.logout();
      }
    }
  }
}
