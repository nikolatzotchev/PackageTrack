import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
// needed for the table
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-trips',
  templateUrl: './manage-trips.component.html',
  styleUrls: ['./manage-trips.component.css']
})
export class ManageTripsComponent implements OnInit {
  displayTable = false;
  tableDatabase = new TableDatabase();
  dataSource: TableDataSource;
  displayedColumns = ['tripId', 'description', 'deviceId', 'displayTrip', 'endTrip'];
  displayOnGmap = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<ManageTripsComponent>,
    private http: Http, public dialog: MatDialog) { }

  ngOnInit() {
    this.http.get('http://192.168.1.107:8080/api/v1/trips')
      .map(resp => resp.json())
      .subscribe(
        resp => {
          resp.forEach(element => {
            this.tableDatabase.data.push({'tripId': element.id, 'deviceId': element.device.id, 'description': element.description});
          });
        },
      (err) => console.error(err),
      // finally display the table
      () => this.displayTable = true
      );
      this.dataSource = new TableDataSource(this.tableDatabase);
  }

  // see if there is data to display
  checkSize(): number {
    return this.tableDatabase.data.length;
  }

  endTrip(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Are you sure you want to delete trip ${id}`
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ headers: headers });
        this.http.post(`http://192.168.1.107:8080/api/v1/trips/${id}/endTrip`, options).subscribe();
        this.tableDatabase.data.splice(this.tableDatabase.data.findIndex(item => item.tripId === id), 1);
        this.dataSource = new TableDataSource(this.tableDatabase);
      }
    });
  }

  displayTrip(id) {
    this.displayOnGmap.emit(id);
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
