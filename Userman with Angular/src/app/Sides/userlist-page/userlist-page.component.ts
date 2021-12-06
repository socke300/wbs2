import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../Service/auth.service';

@Component({
  selector: 'app-userlist-page',
  templateUrl: './userlist-page.component.html',
  styleUrls: ['./userlist-page.component.css']
})
export class UserlistPageComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
