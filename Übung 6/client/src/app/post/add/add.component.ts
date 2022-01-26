import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from "../../models/post.model";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  post: string = '';
  @Output() add: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {
  }

}
