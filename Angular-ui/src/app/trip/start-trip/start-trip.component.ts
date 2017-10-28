import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';

import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-start-trip',
  templateUrl: './start-trip.component.html',
  styleUrls: ['./start-trip.component.css']
})
export class StartTripComponent implements OnInit {
  displayedColumns = ['tripId', 'description', 'deviceId', 'actions'];
  displayTable = false;
  dataSource: TableDataSource;
  tripDatabase = new TableDatabase();

  constructor(public dialogRef: MatDialogRef<StartTripComponent>,
     private http: Http, public dialog: MatDialog) { }

  ngOnInit() {
    this.http.get('http://192.168.1.107:8080/api/v1/trips/not-started')
      .map(res => res.json())
      .subscribe(
      resp => {
        resp.forEach(m => this.tripDatabase.data.push({ 'tripId': m.id, 'deviceId': m.device.id, 'description': m.description }));
      },
      (err) => console.error(err),
      () => this.displayTable = true
      );
    this.dataSource = new TableDataSource(this.tripDatabase);
  }
  // see if there is data to display
  checkSize(): number {
    return this.tripDatabase.data.length;
  }
  startTrip(trip) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Are you sure you want to start trip ${trip.tripId}`
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ headers: headers });
        this.http.post(`http://192.168.1.107:8080/api/v1/trips/${trip.tripId}/startTrip`, options).subscribe();
        // close the trip with true so the main component can show grow message
        this.dialogRef.close(true);
      }
    });
  }
}

export interface Element {
  tripId: number;
  deviceId: number;
  description: string;
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

