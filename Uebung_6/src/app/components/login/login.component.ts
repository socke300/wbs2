import { Component } from '@angular/core';
import {UserServiceService} from "../../user-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  email: string = '';
  password: string = '';

  constructor(public userService: UserServiceService) { }

  async login(){
    const result = await this.userService.login(this.email, this.password);
  }

  firstDemo(){
    this.email = "kevin.linne@mail.de";
    this.password = "kevin123"
  }

  secondDemo(){
    this.email = "samuel.schepp@mail.de";
    this.password = "samuel123";

  }
}
