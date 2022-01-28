import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  user: any = {};
  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  saveUser(){
    if (this.user.username.trim().length > 0){
      this.dataService.addUser(this.user);
      this.clearInput()
    }
  }

  clearInput(){
    this.user = {};
  }

}
