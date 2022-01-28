import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../Post";
import {UserServiceService} from "../../user-service.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input() post!: Post;

  constructor(public userService: UserServiceService, public afs:AngularFirestore) { }

  ngOnInit(): void {
  }

  async deletePost(){
    await this.afs.collection<Post>('posts').doc(this.post.dId).delete();
  }

}
