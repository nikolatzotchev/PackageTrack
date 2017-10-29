import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
// imports needed for the table
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component';

@Component({
  selector: 'app-delete-device-dialog',
  templateUrl: './delete-device-dialog.component.html',
  styleUrls: ['./delete-device-dialog.component.css']
})
export class DeleteDeviceDialogComponent implements OnInit {

  exampleDatabase = new TableDatabase();
  displayTable = false;
  displayedColumns = ['id', 'serialNo', 'actions'];
  dataSource: TableDataSource;
  msgs: Message[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteDeviceDialogComponent>, private http: Http,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllDevices();

  }

  getAllDevices() {
    this.http.get('http://192.168.1.107:8080/api/v1/devices')
      .map(res => res.json())
      .subscribe(
      resp => {

        resp.forEach(m => this.exampleDatabase.data.push({ 'id': m.id, 'serialNo': m.serialNo }));

      },
      (error) => {
        const dialogRef = this.dialog.open(ErrorHandlingComponent, {
          data: error.json().message
        });
      },
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Are you sure you want to remove device ${id}`
    });
    dialogRef.afterClosed().subscribe(
      result => {
        // only deleting when yes is pressed
        if (result === true) {
          this.http.delete(`http://192.168.1.107:8080/api/v1/devices/${id}/`).subscribe();
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Device Deleted' });
          this.exampleDatabase.data.splice(this.exampleDatabase.data.findIndex(item => item.id === id), 1);
          this.dataSource = new TableDataSource(this.exampleDatabase);
        } else {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: 'Deletion canceled.' });
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

  disconnect() { }
}
