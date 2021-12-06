import { Component, OnInit } from '@angular/core';
import {ClientDataService} from "../Services/client-data.service";
import {EditUserModalComponent} from "../edit-user-modal/edit-user-modal.component";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SocketServiceService} from "../Services/socket-service.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  editPath: string = '/editModal';
  deletePath: string = '/delete';
  normalPath: string = '/list';

  constructor(private location: Location, public clientData: ClientDataService, private modalService: NgbModal, public socketService: SocketServiceService) {

  }

  async editUser(id: number){
    this.location.go(this.clientData.modalPath + '/' + id);
    let user: any = this.clientData.getUserById(id);
    const modalReference = this.modalService.open(EditUserModalComponent);
    this.socketService.block(id);
    modalReference.componentInstance.firstName = user.firstName;
    modalReference.componentInstance.lastName = user.lastName;
    try{
      const result: string[] = await modalReference.result;
      this.clientData.edit(result[0], result[1], id);
    }catch(error){
      console.log(error);
    }
    this.socketService.unblock(id);
  }

  ngOnInit(): void {
  }

}
