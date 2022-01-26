import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  username = '';
  password = '';

  constructor(public auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.checkLogin();
  }
}
