import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import 'rxjs/add/operator/catch';
import {ErrorHandlingComponent} from '../../error-handling/error-handling.component';
@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  selectedDevice: any;
  tripDescription: string;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // array with device ids
  devices = [];
  // body of create trip post
  data = {};
  // true if you want a trip to be started when created
  startTrip = false;

  constructor(public dialogRef: MatDialogRef<CreateTripComponent>,
     private _formBuilder: FormBuilder, private http: Http, public dialog: MatDialog ) { }

  ngOnInit() {
    this.getDevicesId();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  getDevicesId() {
    this.http.get('http://192.168.1.107:8080/api/v1/devices')
    .map(res => res.json())
    .subscribe(
    resp => {

      resp.forEach(m => this.devices.push({ 'id': m.id }));

    },
    (error) => {
      console.log(error);
      const dialogRef = this.dialog.open(ErrorHandlingComponent, {
        data: error.json()
      });
    }
    );
  }

  createTrip() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    // push device id and description
    this.data = { 'deviceId': this.selectedDevice, 'description': this.tripDescription} ;
    this.http.post('http://192.168.1.107:8080/api/v1/trips', JSON.stringify(this.data), options)
    .subscribe(
    (resp) => {
      // if we wont to start the trip right after it is created
      if (this.startTrip === true) {
        this.http.post(`http://192.168.1.107:8080/api/v1/trips/${resp.json().id}/startTrip`, options).subscribe();
      }
    },
    (error) => {
      const dialogRef = this.dialog.open(ErrorHandlingComponent, {
        data: error.json().message
      });
      dialogRef.afterClosed().subscribe(() => {
        this.dialogRef.close(false);
      });
    },
    () =>  this.dialogRef.close(true)
    );
  }
}
