import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {SelectItem} from 'primeng/components/common/api';
import {Message} from 'primeng/components/common/api';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Http, Request, RequestOptionsArgs, RequestOptions,
    Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend } from '@angular/http';

import 'rxjs/add/operator/map';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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
  exampleDatabase = new ExampleDatabase();
  displayTable = false;
  isDataAvailible = false;
  displayedColumns = ['id', 'serialNo', 'actions'];
  dataSource: ExampleDataSource;

  constructor(
    public dialogRef: MatDialogRef<DeleteDeviceDialogComponent>, private http: Http, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAllDevices();
    this.dataSource = new ExampleDataSource(this.exampleDatabase);
  }

  getAllDevices() {
    this.http.get('http://192.168.1.107:8080/api/v1/devices')
    .map(res => res.json())
    .subscribe(
      resp => {
          if (resp.length > 0) {
            this.displayTable = true;
            resp.forEach(m => this.exampleDatabase.data.push({'id': m.id, 'serialNo': m.serialNo}));
          } else {
            this.displayTable = false;
          }
      },
      (err) => console.error(err),
      () => this.isDataAvailible = true
    );

  }

  removeDevice(id, serialNo) {
    this.http.delete(`http://192.168.1.107:8080/api/v1/devices/${id}/`).subscribe();
    this.dataSource = new ExampleDataSource(this.exampleDatabase);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface Element {
  serialNo: string;
  id: number;
}

export class ExampleDatabase {
  dataChange: BehaviorSubject<Element[]> = new BehaviorSubject<Element[]>([]);
  get data(): Element[] {
    return this.dataChange.value;
  }
}

export class ExampleDataSource extends DataSource<any> {
  constructor(private data: ExampleDatabase) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return this.data.dataChange;
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
