import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import auth = firebase.auth;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  user: firebase.User | null | undefined = undefined;
  constructor(public auth: AngularFireAuth) {
    this.auth.user.subscribe(user => this.user = user)
  }

  ngOnInit(): void {
  }

  login(){
    this.auth.signInWithEmailAndPassword(this.email, this.password);
  }
  loginWithGoogle(){
    this.auth.signInWithPopup(new auth.GoogleAuthProvider())
  }
  logout(){
    this.auth.signOut();
  }
  testUser1(){
    this.email = "max.muster@muster.de";
    this.password = "123456";
  }
  testUser2(){
    this.email = "maria.muster@muster.de";
    this.password = "123456";
  }
}
