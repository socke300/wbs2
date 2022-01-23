import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToDoEntry} from "../../Model/ToDoEntry";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddTodoComponent} from "../add-todo/add-todo.component";
import {DataService} from "../../Service/data.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() title: string = "";
  @Input() list: ToDoEntry[] = [];
  @Input() buttonName: string = "";
  @Input() showDeleteButton: boolean = false;
  @Output() addEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() addEvent2: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }
}
