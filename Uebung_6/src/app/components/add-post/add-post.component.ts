import { Component, OnInit } from '@angular/core';
import {Post} from "../../Post";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserServiceService} from "../../user-service.service";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  constructor( public afs: AngularFirestore, public userService: UserServiceService) { }

  ngOnInit(): void {
  }

  async addPost(text: string){
    if( this.userService.user && this.userService.user.email){
      let newPost = new Post(text, this.userService.user.uid, this.userService.user.email, (new Date()).toString());
      await this.afs.collection<Post>('posts').add({...newPost});
    }
  }

}
