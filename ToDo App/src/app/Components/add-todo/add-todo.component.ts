import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {

  public title: string;

  constructor(public activeModal: NgbActiveModal) {
    this.title = "";
  }

  ngOnInit(): void {
  }

  save(){
    if (this.title.trim().length > 0){
      this.activeModal.close(this.title);
    }
  }
}
