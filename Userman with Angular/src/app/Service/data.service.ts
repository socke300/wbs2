import {Injectable} from '@angular/core';
import {User} from '../Model/User';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userList: User[] = [];

  constructor(private httpClient: HttpClient, private alertService: AlertService) {
  }

  async getUserList(): Promise<void> {
    const res: any = await this.httpClient.get('http://localhost:8080/users').toPromise();
    this.userList = res.userList;
  }

  async getUserByID(id: number): Promise<User> {
    await this.getUserList();
    return <User> this.userList.find(item => item.id == id);
  }

  async editUser(firstName: string, lastName: string, id: number): Promise<void> {
    await this.httpClient.put('http://localhost:8080/user/' + id, {
      firstName: firstName,
      lastName: lastName
    }).toPromise();
    this.getUserList().then();
  }

  async deleteUser(userID: number): Promise<void> {
    try {
      await this.httpClient.delete('http://localhost:8080/user/' + userID, {}).toPromise();
      this.getUserList().then();
      this.alertService.add('User deleted!');
    } catch (e) {
      this.alertService.add('User cannot be deleted!');
    }
  }

  async addUser(user: User, password: string, description: string): Promise<void> {
    try {
      await this.httpClient.post('http://localhost:8080/user', {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: password,
        description: description
      }).toPromise();
      this.getUserList().then();
      this.alertService.add('User "' + user.username + '" created!');
    } catch (e) {
      this.alertService.add('User cannot be created!');
    }
  }
}
