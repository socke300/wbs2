import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../model/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;
  @Output() deleteEvent: EventEmitter<string> = new EventEmitter();
  @Output() updateEvent: EventEmitter<User> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  delete(): void {
    this.deleteEvent.emit(this.user._id);
  }

  update(): void {
      this.updateEvent.emit(this.user);
  }
}
