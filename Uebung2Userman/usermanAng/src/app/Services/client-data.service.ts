import {Injectable, OnInit} from '@angular/core';
import {User} from "../User";
import {EditUserModalComponent} from "../edit-user-modal/edit-user-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Socket} from "socket.io";
import {io} from "socket.io-client";
import {SocketServiceService} from "./socket-service.service";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class ClientDataService{

  public modalPath = '/editModal';

  public userList: User[] = [];

  constructor(private modalService: NgbModal, private location: Location, private http: HttpClient, public alertService: AlertService) {
    //this.getUserList().then();
  }

  async getUserList(){
    try {
      let res: any = await this.http.get('http://localhost:8080/users').toPromise();
      this.userList = res.userList;
      console.log(res.message);
    }catch(error){
        console.log(error);
    }
  }

  public getUserById(id: number){
    for(const user of this.userList){
      if(user.id === id){
        return user;
      }
    }
    console.log('There is no user with the id:' + id);
    return;
  }

  public addUser(firstName: string, lastName: string, username: string, password: string, description: string){
    this.http.post('http://localhost:8080/user', {
      firstName,
      lastName,
      username,
      password,
      description
    }).toPromise().then((res: any) => {
      console.log(res);
      this.alertService.add("Added User: " + firstName + lastName);
    });
    this.getUserList();
    this.location.go('list');
  }

  async edit(firstName: string, lastName: string, id: number): Promise<void> {
    try {
     let res = await this.http.put('http://localhost:8080/user/' + id, {
        firstName,
        lastName
      }).toPromise();
     console.log(res);
    }catch(error){
      console.log('window closed' + error);
      this.location.go('list');
    }
    this.getUserList();
  }

  async delete(userId: number) {
    try{
      let res: any = await this.http.delete('http://localhost:8080/user/' + userId).toPromise();
      console.log(res);
      this.alertService.delete(userId);
    }catch(error){
      console.log(error);
    }
    this.getUserList();
  }
}
