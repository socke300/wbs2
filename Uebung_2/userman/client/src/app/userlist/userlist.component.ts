import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../models/user.model";
import {faPencilAlt, faPlus, faTrash, faLock} from "@fortawesome/free-solid-svg-icons";
import {DataService} from "../data.service";


@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  @Input() list: {user: User, status: boolean}[] = [];
  @Output() editUserEvent: EventEmitter<User>;
  @Output() removeUserEvent: EventEmitter<User>;
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faPlus = faPlus;
  faLock = faLock;

  constructor(public dataService: DataService) {
    this.editUserEvent = new EventEmitter<User>();
    this.removeUserEvent = new EventEmitter<User>();
  }

  ngOnInit(): void {
  }

  isUserBlocked(user: any){
    let status = false;
    this.dataService.getUserStatus(user.id).then((res: any) => {
      status = res.status
    })
    return status;
  }
}
