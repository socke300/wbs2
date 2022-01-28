import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  firstname: string;
  lastname: string;
  password: string;
  username: string;

  constructor(private userService: UserService) {
  }

  addUser(): void {
    const user: User = {
      _id: null,
      firstName: this.firstname,
      lastName: this.lastname,
      username: this.username,
      password: this.password,
      creationTime: null,
    };
    this.userService.addUser(user);

    this.firstname = '';
    this.lastname = '';
    this.username = '';
    this.password = '';
  }
}
