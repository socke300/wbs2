import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../model/user';
import {AlertService} from './alert.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'http://localhost:3000/';

  public userlistChangedEmitter = new EventEmitter<void>();

  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  getUsers(): Promise<User[]> {
    return this.http.get<User[]>(this.usersUrl + 'user').toPromise()
      .then((res: User[]) => {
        return res;
      })
      .catch((err) => {
        this.errorHandler(err);
        return [];
      });
  }

  addUser(user: User): Promise<void> {
    return this.http.post(this.usersUrl + 'user', user, httpOptions).toPromise()
      .then((res: any) => {
        this.userlistChangedEmitter.emit();
        this.alertService.addAlert({type: 'success', message: res.message});
      })
      .catch((err) => this.errorHandler(err));
  }

  updateUser(user: User): Promise<void> {
    return this.http.put(`${this.usersUrl}user/${user.id}`, user, httpOptions).toPromise()
      .then((res: any) => {
        this.userlistChangedEmitter.emit();
        this.alertService.addAlert({type: 'success', message: res.message});
      })
      .catch((err) => this.errorHandler(err));
  }

  deleteUser(id: number): Promise<void> {
    return this.http.delete(`${this.usersUrl}user/${id}`).toPromise()
      .then((res: any) => {
        this.userlistChangedEmitter.emit();
        this.alertService.addAlert({type: 'success', message: res.message});
      })
      .catch((err) => this.errorHandler(err));
  }

  errorHandler(error: HttpErrorResponse): void {
    this.alertService.addAlert({type: 'danger', message: error.error.message});
  }
}
