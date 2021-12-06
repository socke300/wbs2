import {__decorate} from "tslib";
import {Injectable} from '@angular/core';
import {io} from "socket.io-client";

let WebsocketsService = class WebsocketsService {
  constructor(dataService) {
    this.dataService = dataService;
    this.socket = io();
    this.listener();
  }

  listener() {
    this.socket.on('blockUser', (data) => {
      this.dataService.userList.find(item => item.id == data).isBlocked = true;
    });
    this.socket.on('unblockUser', (data) => {
      this.dataService.userList.find(item => item.id == data).isBlocked = false;
    });
    this.socket.on("updateUserList", () => {
      this.dataService.getUserList().then();
    });
  }

  blockUser(id) {
    this.socket.emit("blockUser", id);
  }

  unblockUser(id) {
    this.socket.emit("unblockUser", id);
  }
};
WebsocketsService = __decorate([
  Injectable({
    providedIn: 'root'
  })
], WebsocketsService);
export {WebsocketsService};
//# sourceMappingURL=websockets.service.js.map
