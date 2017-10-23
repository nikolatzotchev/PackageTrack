import { Component, OnInit, Inject } from '@angular/core';
import {SelectItem} from 'primeng/components/common/api';
import {Message} from 'primeng/components/common/api';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Http, Request, RequestOptionsArgs, RequestOptions,
    Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend } from '@angular/http';

import 'rxjs/add/operator/map';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.css']
})
export class DeviceConfigComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  setDevice(): void {
    const dialogRef = this.dialog.open(SetDeviceDialogComponent, {
      width: '500px',
    });
  }

  deleteDevice(): void {
    const dialogRef = this.dialog.open(DeleteDeviceDialogComponent, {
      width: '500px',
    });
  }
}

@Component({
  selector: 'app-delete-device-config',
  templateUrl: './delete-device-config.component.html'
})
export class DeleteDeviceDialogComponent implements OnInit {
  noDevice = false;
  displayedColumns = ['position', 'name', 'actions'];
  dataSource = new ExampleDataSource();

  constructor(
    public dialogRef: MatDialogRef<DeleteDeviceDialogComponent>, private http: Http ) {}

  ngOnInit() {
    this.http.get('http://192.168.1.107:8080/api/v1/devices')
    .map(res => res.json())
    .subscribe(
      data => {
          data.forEach(m => data.push({'id': m.id, 'serialNo': m.serialNo}));
      }
    );
    if (data.length === 0) {
      this.noDevice = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface Element {
  serialNo: string;
  id: number;
}

const data: Element[] = [
 // {id: 5, serialNo: '12312'}
];

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return Observable.of(data);
  }

  disconnect() {}
}

@Component({
  selector: 'app-dialog-device-config',
  templateUrl: './dialog-device-config.component.html',
  styleUrls: ['./dialog-device-config.component.css']
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
