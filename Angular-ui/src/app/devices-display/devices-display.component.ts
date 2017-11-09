import {Component, OnInit} from '@angular/core';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import {Router} from '@angular/router';
import {GrowlModule} from 'primeng/primeng';
import {MenuItem} from 'primeng/primeng';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-devices-display',
  templateUrl: './devices-display.component.html',
  styleUrls: ['./devices-display.component.css']
})
export class DeviceDisplayComponent implements OnInit {
  devices: Device[];
  progressSpinner = true;
  displayConfirmDialogSet = false;
  displayConfirmDialogDel = false;
  // when adding new device
  serialNum: string;
  // id when deleting device
  deviceId: number;

  // messege to display when there are no devices configured
  emptyMsg = 'Database is empty, please add a device first!';

  constructor(private http: Http, private router: Router, private messageService: MessageService) {
  }

  ngOnInit() {
    // get all devices
    this.http.get(environment.baseUrl + 'devices')
      .map(resp => resp.json())
      .subscribe(
        response => {
          this.devices = response;
        },
        (error) => this.messageService.add(
          {severity: 'error', summary: 'Request Error', detail: error.json().error}
        ),
        () => {
          this.progressSpinner = false;
        }
      );
  }

  addDeviceDialog() {
    this.serialNum = null;
    this.displayConfirmDialogSet = true;
  }

  dellDeviceDialog(id) {
    this.deviceId = id;
    this.displayConfirmDialogDel = true;
  }

  setNewDevice(): void {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});

    this.http.post(environment.baseUrl + 'devices', this.serialNum, options).subscribe(
      () => {
      },
      (error) => this.messageService.add({severity: 'error', summary: 'Request Error', detail: error}),
      () => (
        // close dialog
        this.displayConfirmDialogSet = false,
          this.messageService.add({severity: 'success', summary: 'device added', detail: this.serialNum}),
          this.serialNum = null,
          this.ngOnInit()
      )
    );
  }

  deleteDevice(id) {
    this.http.delete(environment.baseUrl + `devices/${id}/`).subscribe(
      () => {
      },
      (error) => this.messageService.add({severity: 'error', summary: 'Request Error', detail: error}),
      () => (
        this.displayConfirmDialogDel = false,
          this.messageService.add({severity: 'success', summary: 'device deleted', detail: id}),
          this.ngOnInit()
      )
    );
  }

  deviceInfo(deviceId) {
    this.router.navigate(['/device-info', deviceId]);
  }
}

export interface Device {
  id;
  serialNo;
}
