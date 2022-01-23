import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {DataService} from './data.service';
import {User} from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {

  socket: Socket = io();

  constructor(public dataService: DataService) {
    this.listener();
  }

  listener() {
    this.socket.on('blockUser', (data) => {
      (this.dataService.userList.find(item => item.id == data) as User).isBlocked = true;
    });

    this.socket.on('unblockUser', (data) => {
      (this.dataService.userList.find(item => item.id == data) as User).isBlocked = false;
    });

    this.socket.on('updateUserList', () => {
      this.dataService.getUserList().then();
    });
  }

  blockUser(id: number) {
    this.socket.emit('blockUser', id);
  }

  unblockUser(id: number) {
    this.socket.emit('unblockUser', id);
  }
}
