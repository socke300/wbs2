import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-new-todo-button',
  templateUrl: './new-todo-button.component.html',
  styleUrls: ['./new-todo-button.component.css']
})
export class NewTodoButtonComponent implements OnInit {

  //@Output() newTodoEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
  }

}
