import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  test() {
    console.log('Test');
  }
}
