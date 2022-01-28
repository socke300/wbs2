import {Component, Input, OnInit} from '@angular/core';
import {AlertService} from "../alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  alerts: string[] = [];
  constructor(public alertService: AlertService) {
    this.alerts = alertService.alerts;
  }

  ngOnInit(): void {
  }

}
