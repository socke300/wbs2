import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {

  @Input() user: User;

  constructor(public activeModal: NgbActiveModal,
              public userService: UserService,
              public location: Location) {
  }

  save(): void {
    this.userService.updateUser(this.user);
    this.activeModal.close('Save click');
    this.location.go('/userspage');
  }

}
