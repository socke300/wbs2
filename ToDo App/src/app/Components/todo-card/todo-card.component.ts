import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToDoEntry} from "../../Model/ToDoEntry";

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.css']
})
export class TodoCardComponent {

  @Input() toDo: ToDoEntry = new ToDoEntry("");
  @Input() id: number = 0;
  @Input() buttonName: string = "";
  @Input() showDeleteButton: boolean = false;
  @Output() buttonEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteButtonEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }
}
