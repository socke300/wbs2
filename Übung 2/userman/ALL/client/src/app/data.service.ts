import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./models/user.model";
import {Socket} from "ngx-socket-io";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  userlist = this.socket.fromEvent<User[]>('users');

  constructor(private socket: Socket, private httpClient: HttpClient) {
  }

  getUserList(): any{
    return firstValueFrom(this.httpClient.get('http://localhost:8080/api/users'));
  }

  saveUser(user: any) {
    return firstValueFrom(this.httpClient.put('http://localhost:8080/api/user/' + user.id, user))
  }

  addUser(user: any) {
    return firstValueFrom(this.httpClient.post('http://localhost:8080/api/user', user))
  }

  getUser(userID: any) {
    return firstValueFrom(this.httpClient.get('http://localhost:8080/api/user/' + userID))
  }

  getUserStatus(userID: any) {
    return firstValueFrom(this.httpClient.get('http://localhost:8080/api/user/status/' + userID))
  }

  deleteUser(userID: any) {
    return firstValueFrom(this.httpClient.delete('http://localhost:8080/api/user/' + userID));
  }

  checkLogin() {
    return firstValueFrom(this.httpClient.get('http://localhost:8080/api/login'))
  }

  login(username: string, password: string): any {
    // Check if all required fields are filled in
      return firstValueFrom(this.httpClient.post('http://localhost:8080/api/login', {
        username: username,
        password: password
      }))
  }
  logout() {
    // Perform ajax request to log out user
    return firstValueFrom(this.httpClient.post('http://localhost:8080/api/logout', {}))
  }
}
