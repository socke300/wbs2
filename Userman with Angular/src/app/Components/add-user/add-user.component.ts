import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../Model/User';
import {DataService} from '../../Service/data.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  user: User = new User(0, '', '', '', new Date(), 0, false);
  password: string = '';
  description: string = '';

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  addUser() {
    if (this.user.lastName.trim().length > 0 && this.user.firstName.trim().length > 0 &&
      this.user.username.trim().length > 0 && this.password.trim().length > 0) {
      this.dataService.addUser(this.user, this.password, this.description).then();
      (document.getElementById("add-user-form") as HTMLFormElement).reset();
    }
  }

}
