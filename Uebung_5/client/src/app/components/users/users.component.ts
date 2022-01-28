import {Component, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UpdateUserComponent} from '../update-user/update-user.component';
import {Location} from '@angular/common';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
    this.userService.userlistChangedEmitter.subscribe(() => this.getUsers());
    this.authService.loggedInEmitter.subscribe(() => this.getUsers());
  }

  ngOnInit(): void {
    this.userService.getUsers().then(users => {
      this.users = users;
      this.route.params.subscribe((params: any) => {
        if (params.id != null) {
          const user = this.users.find((el) => el._id === params.id);

          const modalRef = this.modalService.open(UpdateUserComponent);
          modalRef.componentInstance.user = Object.assign({}, user);
        }
      });
    });
  }

  getUsers(): void {
    this.userService.getUsers().then(users => this.users = users);
  }

  deleteUser(i: number): void {
    this.userService.deleteUser(i);
  }

  showDetail(user: User): void {
    const modalRef = this.modalService.open(UpdateUserComponent);
    modalRef.componentInstance.user = Object.assign({}, user);
    this.location.go('/editpage/user/' + user._id);
  }
}
