import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit {

  private sub: any;
  deviceId: number;
  deviceSerialNo: string;

  constructor(private route: ActivatedRoute, private http: Http) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.deviceId = +params['deviceId']; // (+) converts string 'id' to a number
    });
    console.log(this.deviceId);
    this.http.get(environment.baseUrl + 'devices/' + `${this.deviceId}`).subscribe(
      response => {
        this.deviceSerialNo = response.json().serialNo;
      }
    );
  }

}
