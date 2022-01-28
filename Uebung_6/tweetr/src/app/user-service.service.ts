import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  user: firebase.User | null | undefined = undefined;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    this.auth.user.subscribe(user => this.user = user)
  }

  async login(email: string, password: string){
    await this.auth.signInWithEmailAndPassword(email, password);
    this.user?.updateProfile({displayName:"KevinLinne"});
  }

  async googleLogin(){
    await this.auth.signInWithPopup(new GoogleAuthProvider());
  }

  async logout(){
    await this.auth.signOut();
  }

}
