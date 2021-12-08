import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../models/user.model";
import {faPencilAlt, faTrash, faLock} from "@fortawesome/free-solid-svg-icons";
import {DataService} from "../data.service";
import {EditUserModalComponent} from "../edit-user-modal/edit-user-modal.component";
import {Socket} from "ngx-socket-io";
import {AlertService} from "../alert.service";


@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  @ViewChild('editModal') modal: EditUserModalComponent | undefined;
  list: {user: User, status: boolean}[] = [];
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faLock = faLock;

  constructor(public dataService: DataService, private socket: Socket, private alertService: AlertService) {
    socket.on('add', (username: any) => {
      this.alertService.addAlert('The following user has been created: ' + username);
      this.getUserList()
    })
    socket.on('delete', (username: any) => {
      this.alertService.addAlert('The following user has been deleted: ' + username);
      this.getUserList()
    })
    socket.on('edit', (username: any) => {
      this.alertService.addAlert('The following user was edited: ' + username);
      this.getUserList();
    })
    socket.on('block', () => {
      this.getUserList();
    })
    socket.on('unblock', () => {
      this.getUserList();
    })
    this.getUserList();
  }

  getUserList(){
    this.dataService.buildUserList().then((userList) => {
      this.list = userList;
    });
  }

  removeUser(user: User){
    if(confirm('Wollen Sie wirklich den Nutzer "' + user.username + '" entfernen?')) {
      this.dataService.deleteUser(user);
    }
  }

  ngOnInit(): void {
  }
}
