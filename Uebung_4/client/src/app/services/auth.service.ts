import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertService} from './alert.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  crossDomain: true,
  xhrFields: { withCredentials: true }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  public loggedInEmitter = new EventEmitter<void>();

  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  logIn(username: string, password: string): Promise<void> {
    return this.http.post('http://localhost:3000/session/login', {username, password}, httpOptions)
      .toPromise()
      .then((res: any) => {
        this.loggedIn = true;
        this.loggedInEmitter.emit();
        this.alertService.addAlert({type: 'success', message: res.message});
      })
      .catch((err) => {
        this.alertService.addAlert({type: 'danger', message: err.message});
      });
  }

  checkLogin(): Promise<void> {
    return this.http.get('http://localhost:3000/session/check').toPromise()
      .then((res: any) => {
        this.loggedIn = true;
        this.loggedInEmitter.emit();
        this.alertService.addAlert({type: 'success', message: res.message});
      })
      .catch((err) => {
        this.alertService.addAlert({type: 'danger', message: err.message});
      });
  }

  logOut(): Promise<void> {
    return this.http.post('http://localhost:3000/session/logout', null, httpOptions).toPromise()
      .then((res: any) => {
        this.loggedIn = false;
        this.alertService.addAlert({type: 'success', message: res.message});
      })
      .catch((err) => {
        this.alertService.addAlert({type: 'danger', message: err.message});
      });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
