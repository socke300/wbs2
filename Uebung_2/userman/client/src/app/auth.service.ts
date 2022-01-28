import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: any = undefined;

  constructor(private httpClient: HttpClient) { }

  checkLogin() {
    return firstValueFrom(this.httpClient.get('http://localhost:8080/api/login')).then((res: any) => {
      this.loggedIn = res.user;
    })
  }

  login(username: string, password: string) {
    // Check if all required fields are filled in
    return firstValueFrom(this.httpClient.post('http://localhost:8080/api/login', {
      username: username,
      password: password
    })).then((res: any) => {
      this.loggedIn = res.user;
    })
  }
  logout() {
    // Perform ajax request to log out user
    return firstValueFrom(this.httpClient.post('http://localhost:8080/api/logout', {})).then((res) => {
      this.loggedIn = undefined;
    })
  }
}
