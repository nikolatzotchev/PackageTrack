import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit {

  private sub: any;
  deviceId: any;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.deviceId = +params['deviceId']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });
  }

}
