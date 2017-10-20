import { Component, OnInit, Inject } from '@angular/core';
import {SelectItem} from 'primeng/components/common/api';
import {Message} from 'primeng/components/common/api';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Http, Request, RequestOptionsArgs, RequestOptions,
    Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend } from '@angular/http';

@Component({
  selector: 'app-trip-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.css']
})
export class DeviceConfigComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '500px',
    });
  }
}

@Component({
  selector: 'app-dialog-trip-config',
  templateUrl: './dialog-device-config.component.html',
  styleUrls: ['./dialog-device-config.component.css']
})
export class DeviceDialogComponent implements OnInit {

  msgs: Message[] = [];
  deviceId: string;

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<DeviceDialogComponent>, private http: Http) {}

  onConfirmClick(): void {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});

    this.http.post('/api/v1/devices', this.deviceId, options).subscribe();
    console.log(this.deviceId);
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Order submitted'});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
