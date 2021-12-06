import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ClientDataService} from "./client-data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;
  displayedUsername: string = "";

  constructor(private httpClient: HttpClient, private clientData: ClientDataService) {
    this.isLoggedIn().then();
  }

  async isLoggedIn(): Promise<void> {
    try{
      const res: any = await this.httpClient.get('http://localhost:8080/login').toPromise();
      this.clientData.getUserList().then();
      this.loggedIn = true;
      this.displayedUsername = res.user.username;
    }catch(error){
        console.log(error);
        this.loggedIn = false;
    }
  }

  async login(username: string, password: string): Promise<void> {
    try{
      const res: any = await this.httpClient.post('http://localhost:8080/login', {
        username,
        password
      }).toPromise();
      this.loggedIn = true;
      this.displayedUsername = res.user.username;
      this.clientData.getUserList().then();
    }catch (error) {
      console.log(error);
      this.loggedIn = false;
    }
  }

  async logout(): Promise<void> {
    const res: any = this.httpClient.post('http://localhost:8080/logout', {}).toPromise();
    this.displayedUsername = "";
    //this.clientData.userList = [];
    this.loggedIn = false;
  }
}


