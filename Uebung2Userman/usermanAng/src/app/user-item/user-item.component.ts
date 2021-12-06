import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../User";
import {Location} from "@angular/common";
import {ClientDataService} from "../Services/client-data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EditUserModalComponent} from "../edit-user-modal/edit-user-modal.component";

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent implements OnInit {

  @Input() user: User = ({} as any) as User;
  @Output() deleteEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() editEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
