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

  constructor(private location: Location, private dataService: DataService, public modalService: NgbModal, private socket: Socket, private route: ActivatedRoute) {
    route.params.subscribe(params => {
      if (params['id']) {
        dataService.getUser(params['id']).then((res: any) => {
          this.editUser(res.user, this.editModal);
        })
      }
    });
  }

  editUser(user: User, modalData: any){
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

  ngOnInit(): void {
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
      this.logoutRequest = false;
    }
  }
  saveUser(user: any){
    this.dataService.saveUser(user).then((res) => {
    });
  }
  openNewUserModal(modalDataNew: any){
    this.modalService.open(modalDataNew, {ariaLabelledBy: 'modal-basic-title'})
  }

  closeModalAndSaveUser(modal: any){
    this.dataService.saveUser(this.editedUser).then((res)=> {
      this.socket.emit('edit', this.editedUser.username)
    })
    modal.close('Close click')
  }
}
