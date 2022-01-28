import { Component, OnInit } from '@angular/core';
import {UserServiceService} from "../../user-service.service";

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit {

  constructor(public userService: UserServiceService) { }

  ngOnInit(): void {
  }

}
