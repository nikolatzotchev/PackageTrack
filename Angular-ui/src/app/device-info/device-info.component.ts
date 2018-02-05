import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DeviceService} from '../services/device/device.service';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit {

  private sub: any;
  deviceId: number;
  deviceSerialNo: string;

  constructor(private route: ActivatedRoute, private deviceService: DeviceService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.deviceId = +params['deviceId']; // (+) converts string 'id' to a number
    });
    this.deviceService.getDevice(this.deviceId).subscribe(
      data => {
        this.deviceSerialNo = data.serialNo;
      }
    );
  }

}
