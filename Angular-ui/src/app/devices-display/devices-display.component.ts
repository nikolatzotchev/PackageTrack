import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';

import {Device, DeviceService} from '../services/device/device.service';

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

  // message to display when there are no devices configured
  emptyMsg = 'Database is empty, please add a device first!';

  constructor(private deviceService: DeviceService,
              private router: Router, private messageService: MessageService) {
  }

  ngOnInit() {
    this.deviceService.getAllDevices().subscribe( data => {
      this.devices = [];
      this.devices = data;
      this.checkForCurrentTrip(data);
    });
  }

  checkForCurrentTrip(devices) {
    const requests = devices.map(device => {
      return new Promise((resolve) => {
        let inATrip = false;
        this.deviceService.checkCurrentTrip(device.id)
        .finally(() => {
          device.inATrip = inATrip;
          resolve();
        })
        .subscribe(
          () => inATrip = true,
          () => inATrip = false
        );
      });
    });
    Promise.all(requests).then(() => this.progressSpinner = false);
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
    this.deviceService.setNewDevice(this.serialNum).subscribe(data => {
      this.displayConfirmDialogSet = false,
        this.messageService.add({
          severity: 'success',
          summary: 'device added',
          detail: data.serialNo
        }),
        this.serialNum = null,
        this.progressSpinner = true,
        this.ngOnInit();
    });
  }

  deleteDevice(id) {
    this.deviceService.deleteDevice(id).subscribe( data => {
      this.displayConfirmDialogDel = false,
      this.messageService.add({
        severity: 'success',
        summary: 'device deleted',
        detail: data.serialNo
      }),
      this.progressSpinner = true,
      this.ngOnInit();
    });
  }

  deviceInfo(deviceId) {
    this.router.navigate(['/device-info', deviceId]);
  }
}
