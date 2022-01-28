import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {Location} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(public dataService: DataService, public location: Location, private router: Router) {
    if(!(router.url == '/')){
      dataService.addToDoButtonClicked();
    }
  }

  ngOnInit(): void {
  }

}
