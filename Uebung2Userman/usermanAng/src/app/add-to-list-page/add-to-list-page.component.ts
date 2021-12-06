import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ClientDataService} from "../Services/client-data.service";
import {Location} from "@angular/common";
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-to-list-page',
  templateUrl: './add-to-list-page.component.html',
  styleUrls: ['./add-to-list-page.component.css']
})
export class AddToListPageComponent implements OnInit {

  form = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    userName: new FormControl(),
    password: new FormControl(),
    description: new FormControl()
  });

  constructor(private clientData: ClientDataService, private router: Router) {

  }

  onSubmit(){
    this.clientData.addUser(this.form.value.firstName, this.form.value.lastName, this.form.value.userName, this.form.value.password, this.form.value.description);
    this.router.navigateByUrl('/list');
  }

  /*
  public firstName: string;
  public lastName: string;
  public userName: string;
  public password: string;
  public description: string;*/


  ngOnInit(): void {
  }

}
