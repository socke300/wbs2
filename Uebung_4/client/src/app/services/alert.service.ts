import {Injectable} from '@angular/core';
import {IAlert} from '../model/IAlert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alerts: IAlert[] = [];

  constructor() {}

  addAlert(alert: IAlert): void {
    this.alerts.push(alert);
    setTimeout(() => {
      this.alerts.splice(this.alerts.length - 1, 1);
    }, 3000);
  }

  removeAlert(alert: IAlert): void {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  getAlerts(): IAlert[] {
    return this.alerts;
  }
}
