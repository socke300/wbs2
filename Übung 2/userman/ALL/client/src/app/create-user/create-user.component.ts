import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  user: any = {};
  @Output() newUser: EventEmitter<any>;
  constructor() {
    this.newUser = new EventEmitter<any>();
  }

  ngOnInit(): void {
  }

  saveUser(){
    this.newUser.emit(this.user);
  }

  clearInput(){
    this.user = {};
  }

}
