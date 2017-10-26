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
import {SetDeviceDialogComponent} from './set-device-config/set-device-config.component';
import { ConfirmDeleteDeviceComponent } from './confirm-delete-device/confirm-delete-device.component';


@Component({
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.css'],
  providers: [SetDeviceDialogComponent]
})
export class DeviceConfigComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  setDevice(): void {
    const dialogRef = this.dialog.open(SetDeviceDialogComponent, {
      width: '350px'
    });
  }

  deleteDevice(): void {
    const dialogRef = this.dialog.open(DeleteDeviceDialogComponent, {
    });
  }
}

@Component({
  selector: 'app-delete-device-config',
  templateUrl: './delete-device-config.component.html',
  styleUrls: ['./delete-device-config.component.css'],
  providers: [ConfirmDeleteDeviceComponent]
})
export class DeleteDeviceDialogComponent implements OnInit {
  exampleDatabase = new TableDatabase();
  displayTable = false;
  displayedColumns = ['id', 'serialNo', 'actions'];
  dataSource: TableDataSource;
  msgs: Message[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteDeviceDialogComponent>, private http: Http,
     public dialog: MatDialog, private deleteComp: ConfirmDeleteDeviceComponent) {}

  ngOnInit() {
    this.getAllDevices();

  }

  getAllDevices() {
    this.http.get('http://192.168.1.107:8080/api/v1/devices')
    .map(res => res.json())
    .subscribe(
      resp => {

            resp.forEach(m => this.exampleDatabase.data.push({'id': m.id, 'serialNo': m.serialNo}));

      },
      (err) => console.error(err),
      () => this.displayTable = true
    );
    this.dataSource = new TableDataSource(this.exampleDatabase);
  }

  // see if there is data to display
  checkSize(): number {
     return this.exampleDatabase.data.length;
  }

  removeDevice(id, serialNo): void {
    // open new dialog
    const dialogRef = this.dialog.open(ConfirmDeleteDeviceComponent, {});
    // getting the reference to the opened dialog
    this.deleteComp = dialogRef.componentInstance;
    dialogRef.afterClosed().subscribe(
      selection => {
        // only deleting when yes is pressed
        if (this.deleteComp.confirm === true) {
          this.http.delete(`http://192.168.1.107:8080/api/v1/devices/${id}/`).subscribe();
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: 'Device Deleted'});
          this.exampleDatabase.data.splice(this.exampleDatabase.data.findIndex(item => item.id === id), 1);
          this.dataSource = new TableDataSource(this.exampleDatabase);
        } else {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: 'Deletion canceled.'});
        }
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface Element {
  serialNo: string;
  id: number;
}

export class TableDatabase {
  dataChange: BehaviorSubject<Element[]> = new BehaviorSubject<Element[]>([]);
  get data(): Element[] {
    return this.dataChange.value;
  }
}

export class TableDataSource extends DataSource<any> {
  constructor(private data: TableDatabase) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return this.data.dataChange;
  }

  disconnect() {}
}
