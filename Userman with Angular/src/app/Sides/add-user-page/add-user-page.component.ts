import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../Service/auth.service';

@Component({
  selector: 'app-add-user-side',
  templateUrl: './add-user-page.component.html',
  styleUrls: ['./add-user-page.component.css']
})
export class AddUserPageComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
