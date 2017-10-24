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
import {ConfirmDeleteComponent} from './dialogs/device-dialog-config.component';

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
  providers: [ConfirmDeleteComponent]
})
export class DeleteDeviceDialogComponent implements OnInit {
  exampleDatabase = new TableDatabase();
  displayTable = false;
  displayedColumns = ['id', 'serialNo', 'actions'];
  dataSource: TableDataSource;
  msgs: Message[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteDeviceDialogComponent>, private http: Http,
     public dialog: MatDialog, private deleteComp: ConfirmDeleteComponent) {}

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
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {});
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
