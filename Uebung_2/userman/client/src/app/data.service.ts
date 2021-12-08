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
    return firstValueFrom(this.httpClient.put('http://localhost:8080/api/user/' + user.id, user)).then((res) => {
      this.socket.emit('edit', user.username);
    })
  }

  addUser(user: any) {
    return firstValueFrom(this.httpClient.post('http://localhost:8080/api/user', user)).then((res) => {
      this.socket.emit('add', user.username)
    })
  }

  getUser(userID: any) {
    return firstValueFrom(this.httpClient.get('http://localhost:8080/api/user/' + userID))
  }

  getUserStatus(userID: any) {
    return firstValueFrom(this.httpClient.get('http://localhost:8080/api/user/status/' + userID))
  }

  deleteUser(user: User) {
    return firstValueFrom(this.httpClient.delete('http://localhost:8080/api/user/' + user.id)).then((res) => {
      this.socket.emit('delete', user.username);
    })
  }

  buildUserList(): Promise<{user: User, status: boolean}[]>{
    return this.getUserList().then((res: any) => {
      let users = res.userList as User[];
      let newList: {user: User, status: boolean}[] = [];
      for(let user of users) {
        this.getUserStatus(user.id).then((res: any) => {
          newList.push({user: user, status: res.status})
        })
      }
      return newList;
    })
  }
}
