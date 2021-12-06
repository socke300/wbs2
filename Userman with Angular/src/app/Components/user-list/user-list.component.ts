import {Component, OnInit} from '@angular/core';
import {DataService} from '../../Service/data.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditUserModalComponent} from '../edit-user-modal/edit-user-modal.component';
import {DeleteUserModalComponent} from '../delete-user-modal/delete-user-modal.component';
import {Location} from '@angular/common';
import {User} from '../../Model/User';
import {ActivatedRoute} from '@angular/router';
import {WebsocketsService} from '../../Service/websockets.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  editPath: string = '/edit/';
  normalPath: string = '/userlist';

  constructor(
    public dataService: DataService,
    private ngbModal: NgbModal,
    private location: Location,
    private route: ActivatedRoute,
    private websocketsService: WebsocketsService
  ) {
    route.params.subscribe(params => {
      if (location.path().includes(this.editPath)) {
        this.editBtn(params.id).then();
      }
    });
  }

  ngOnInit(): void {
  }

  async editBtn(id: number): Promise<void> {
    this.location.go(this.editPath + id);
    this.websocketsService.blockUser(id);
    const user: User = await this.dataService.getUserByID(id);
    const modalReference = this.ngbModal.open(EditUserModalComponent);
    modalReference.componentInstance.firstname = user.firstName;
    modalReference.componentInstance.lastname = user.lastName;
    modalReference.componentInstance.username = user.username;
    try {
      const result: string[] = await modalReference.result;
      await this.dataService.editUser(result[0], result[1], id);
    } catch (e) {
      console.log('editBtn closed: ' + e);
    }
    this.location.go(this.normalPath);
    this.websocketsService.unblockUser(id);
  }

  async deleteBtn(id: number): Promise<void> {
    const modalReference = this.ngbModal.open(DeleteUserModalComponent);
    modalReference.componentInstance.username = (await this.dataService.getUserByID(id)).username;
    this.websocketsService.blockUser(id);
    try {
      await modalReference.result;
      await this.dataService.deleteUser(id);
    } catch (e) {
      console.log('deleteBtn closed: ' + e);
    }
    this.websocketsService.unblockUser(id);
  }
}
