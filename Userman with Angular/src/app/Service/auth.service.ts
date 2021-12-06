import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogin: boolean = false;
  userName: string = '';

  constructor(private httpClient: HttpClient, private dataService: DataService) {
    this.checkLogin().then();
  }

  async checkLogin(): Promise<void> {
    try {
      const res: any = await this.httpClient.get('http://localhost:8080/login').toPromise();
      this.dataService.getUserList().then();
      this.isLogin = true;
      this.userName = res.user.username;
    } catch (e) {
      console.log('Check Login Error: ' + e.error.message);
      this.isLogin = false;
    }
  }

  async login(username: string, password: string): Promise<void> {
    try {
      await this.httpClient.post('http://localhost:8080/login', {
        username: username,
        password: password
      }).toPromise();
      this.isLogin = true;
      this.userName = username;
      this.dataService.getUserList().then();
    } catch (e) {
      console.log('Login Error: ' + e);
      this.isLogin = false;
    }
  }

  logout(): void {
    this.httpClient.post('http://localhost:8080/logout', {}).toPromise().then();
    this.userName = '';
    this.dataService.userList = [];
    this.isLogin = false;
  }
}
