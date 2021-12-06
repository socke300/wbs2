import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {AuthService} from "../Services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    userName: new FormControl(),
    password: new FormControl()
  });

  constructor(private authService: AuthService) { }

  onSubmit(){
    this.authService.login(this.form.value.userName, this.form.value.password);
  }

  ngOnInit(): void {
  }

}
