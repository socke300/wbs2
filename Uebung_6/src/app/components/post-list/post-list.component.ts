import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Post} from "../../Post";
import {Observable} from "rxjs";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent{

  public postCollection: AngularFirestoreCollection<Post>;
  public posts: Observable<Post[]>;

  constructor(public afs: AngularFirestore) {
    this.postCollection = afs.collection<Post>('posts', ref => ref.orderBy('time', 'desc'));
    this.posts = this.postCollection.valueChanges({idField: "dId"});
    console.log(this.posts)
  }


}
