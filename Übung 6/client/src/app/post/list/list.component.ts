import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  postsCollection!: AngularFirestoreCollection<any>
  posts: any[] = [];
  @Input() user: firebase.User | undefined;
  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    this.init();
  }

  async init() {
    this.postsCollection = await this.afs.collection<any>('posts', ref => ref.orderBy('time', 'desc'));
    await this.postsCollection.valueChanges({idField: 'id'}).subscribe(docs => this.posts = docs);
    this.posts.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  ngOnInit(): void {
  }

  add(text: string){
    let post = new Post(text);
    post.user = this.user?.email;
    post.time = new Date();
    this.postsCollection.add(JSON.parse(JSON.stringify(post)));
  }
  remove(post: any){
    console.log(post);
    this.postsCollection.doc(post.id).delete();
  }
}
