import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from '../User';
import {ClientDataService} from "./client-data.service";

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {

  socket: Socket = io();

  constructor(public clientData: ClientDataService) {
    this.listener();
  }

  listener() {

    this.socket.on('blocked', (data) => {
      console.log(this.clientData.userList);
      (this.clientData.userList.find(item => item.id == data) as User).blocked = true;
      console.log("test blockiert");
    });

    this.socket.on('unblock', (data) => {
      (this.clientData.userList.find(item => item.id == data) as User).blocked = false;
    });

    this.socket.on('updateList', (data) => {
      this.clientData.getUserList().then();
    });
  }

  block(index: number){
    this.socket.emit('blocked', index);
  }

  unblock(index: number){
    this.socket.emit('unblock', index);
  }
}
