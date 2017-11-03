import { Component, OnInit } from '@angular/core';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-devices-display',
  templateUrl: './devices-display.component.html',
  styleUrls: ['./devices-display.component.css']
})
export class DeviceDisplayComponent implements OnInit {
  devices: Device[];
  progressSpinner = true;
  display = false;
  serialNum: string;
  constructor(private http: Http, private router: Router) { }

  ngOnInit() {
    // get all devices
    this.http.get('http://192.168.1.107:8080/api/v1/devices')
      .map(resp => resp.json())
      .subscribe(
        response => {
          this.devices = response;
        },
        (error) => console.log(error),
        () =>  {
          console.log(this.devices);
          this.progressSpinner = false;
        }
      );
  }

  addDevice() {
    this.display = true;
  }

  setNewDevice(): void {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    this.http.post('http://192.168.1.107:8080/api/v1/devices', this.serialNum, options).subscribe(
      () => {},
      (error) => (console.log(error)),
      () => (
        this.display = false,
        this.ngOnInit()
      )
    );
  }
}
export interface Device {
  id;
  serialNo;
}
