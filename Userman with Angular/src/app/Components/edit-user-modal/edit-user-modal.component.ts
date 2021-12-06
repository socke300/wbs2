import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {

  firstname: string = '';
  lastname: string = '';
  username: string = '';

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  save() {
    if (this.lastname.trim().length > 0 && this.firstname.trim().length > 0) {
      this.activeModal.close([this.firstname, this.lastname]);
    }
  }
}
