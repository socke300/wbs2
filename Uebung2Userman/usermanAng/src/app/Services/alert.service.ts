import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertList: string[] = [];

  constructor() { }

  deleteAutomatic(index: number) {
    setTimeout(() => {
      this.alertList.splice(index, 1);
    }, 5000);
  }

  add(text: string) {
    this.alertList.push(text);
    this.deleteAutomatic(this.alertList.length - 1);
  }

  delete(index: number) {
    this.alertList.splice(index, 1);
  }

}
