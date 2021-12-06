import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToDoEntry} from "../ToDoEntry";

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() todo: ToDoEntry = new ToDoEntry('');
  @Output() doneEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() undoneEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
