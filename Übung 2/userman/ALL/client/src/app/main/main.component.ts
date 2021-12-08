import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../data.service";
import {User} from "../models/user.model";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Socket} from "ngx-socket-io";
import {ActivatedRoute} from "@angular/router";
import {AlertService} from "../alert.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild("modalData") editModal: TemplateRef<any> | undefined;
  page = 0;
  logoutRequest: boolean = false;
  loggedIn: any = undefined;
  list: {user: User, status: boolean}[] = [];
  error: string = '';
  displayStyle: boolean = false;
  closeModal: string = '';
  // @ts-ignore
  editedUser: User;

  constructor(private location: Location, private dataService: DataService, public modalService: NgbModal, private socket: Socket, private route: ActivatedRoute, private alertService: AlertService) {
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
    route.params.subscribe(params => {
      if (params['id']) {
        dataService.getUser(params['id']).then((res: any) => {
          this.editUser(res.user, this.editModal);
        })
      }
    });
  }

  addUser(newUser: any){
    this.dataService.addUser(newUser).then((res)=> {
      this.socket.emit('add', newUser.username);
    });
  }

  editUser(user: User, modalData: any){
    //ToDo: Open Modal also if accessed via URL
    this.location.go('/user/' + user.id);
    this.editedUser = {...user};
    this.socket.emit('block', user.id);
    this.modalService.open(modalData, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
      this.socket.emit('unblock', user.id);
      this.location.go('');
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      this.socket.emit('unblock', user.id);
      this.location.go('');
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  removeUser(user: User){
    if(confirm('Wollen Sie wirklich den Nutzer "' + user.username + '" entfernen?')) {
      this.dataService.deleteUser(user.id).then((res)=> {
        this.socket.emit('delete', user.username);
      })
    }
  }
  ngOnInit(): void {
    this.getUserList()
  }
  processErrorEvent(err: HttpErrorResponse){
    if (err.status === 401){
      this.logoutRequest = true;
    }
    this.error = err.error.message;
    setTimeout(() => {
      this.error = "";
    }, 5000)
  }
  handleLogin(loggedIn: any){
    this.loggedIn = loggedIn;
    if (loggedIn) {
      this.getUserList();
      this.logoutRequest = false;
    }
  }
  saveUser(user: any){
    this.dataService.saveUser(user).then((res) => {
      this.socket.emit('edit', user.username)
    });
  }
  openNewUserModal(modalDataNew: any){
    this.modalService.open(modalDataNew, {ariaLabelledBy: 'modal-basic-title'})
  }
  getUserList(){
    this.dataService.getUserList().then((res: any) => {
      let users = res.userList as User[];
      let newList: {user: User, status: boolean}[] = [];
      for(let user of users) {
        this.dataService.getUserStatus(user.id).then((res: any) => {
          newList.push({user: user, status: res.status})
        })
      }
      this.list = newList;
    })
  }
  closeModalAndSaveUser(modal: any){
    this.dataService.saveUser(this.editedUser).then((res)=> {
      this.socket.emit('edit', this.editedUser.username)
    })
    modal.close('Close click')
  }
}
