import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {

  public firstName: string;
  public lastName: string;

  constructor(public activeModal: NgbActiveModal) {
    this.firstName = '';
    this.lastName = '';
  }

  save(): void{
    if(this.lastName.trim().length > 0 && this.firstName.trim().length > 0){
      this.activeModal.close([this.firstName, this.lastName]);
    }
  }

  ngOnInit(): void {
  }

}
