import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-to-do-page',
  templateUrl: './to-do-page.component.html',
  styleUrls: ['./to-do-page.component.css']
})
export class ToDoPageComponent implements OnInit {

  constructor(public dataService: DataService, public location: Location) { }

  ngOnInit(): void {
  }

}
