import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers
} from '@angular/http';



@Component({
  selector: 'app-set-device-config',
  templateUrl: './set-device-config.component.html',
  styleUrls: ['./set-device-config.component.css']
})
export class SetDeviceDialogComponent implements OnInit {

  deviceId: string;

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<SetDeviceDialogComponent>, private http: Http) { }

  onConfirmClick(): void {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    this.http.post('http://192.168.1.107:8080/api/v1/devices', this.deviceId, options).subscribe();
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
