import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../models/user.model";
import {DataService} from "../data.service";

@Component({
  selector: 'edit-user-modal-content',
  template: `
      <div class="modal-header">
        <h5 class="modal-title" id="edit-user-modal-title">Edit user: </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="modal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <input type="hidden" aria-hidden="true" id="edit-id-input">
          <label class="form-label">Firstname</label>
          <input class="form-control" type="text" aria-label="First name" [(ngModel)]="user.firstName">
          <label class="form-label">Lastname</label>
          <input class="form-control" type="text" aria-label="Last name" [(ngModel)]="user.lastName">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" (click)="modal.close('Close click')">Close
        </button>
        <button type="submit" class="btn btn-info" (click)="modal.close('Save click')">Save changes
        </button>
      </div>
  `
})
export class EditUserModalContent {
  @Input() user!: User;
  constructor(public modal: NgbActiveModal) {}

}


@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {
  @ViewChild('editModal') editModal: any;

  constructor(private modal: NgbModal, private dataService: DataService) { }

  ngOnInit(): void {
  }

  open(user: User){
    const modalRef = this.modal.open(EditUserModalContent);
    modalRef.componentInstance.user = user;
    modalRef.result.then((result) => {
      this.dataService.saveUser(user);
    })
  }
}
