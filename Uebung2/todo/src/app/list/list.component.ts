import {Component, Input, OnInit} from '@angular/core';
import { ToDoEntry } from "../ToDoEntry";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddTodoComponent} from "../add-todo/add-todo.component";
import {DataService} from "../data.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() givenList: ToDoEntry[] = [];
  @Input() title: string = '';

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
  }

}
