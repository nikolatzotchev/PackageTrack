import { Component, OnInit } from '@angular/core';
import {Message} from 'primeng/components/common/api';
import {MatDialog, MatDialogRef} from '@angular/material';
import { Http, Request, RequestOptionsArgs, RequestOptions,
    Response, Headers } from '@angular/http';



@Component({
  selector: 'app-set-device-config',
  templateUrl: './set-device-config.component.html',
  styleUrls: ['./set-device-config.component.css']
})
export class SetDeviceDialogComponent implements OnInit {

  msgs: Message[] = [];
  deviceId: string;

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<SetDeviceDialogComponent>, private http: Http) {}

  onConfirmClick(): void {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});

    this.http.post('/api/v1/devices', this.deviceId, options).subscribe();
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Device Set'});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
