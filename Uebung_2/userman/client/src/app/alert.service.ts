import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alerts: string[] = [];
  constructor() { }

  addAlert(alert: string) {
    this.alerts.push(alert);
    setTimeout(() => {
      this.removeAlert(alert);
    }, 5000);
  }

  removeAlert(alert: string){
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
