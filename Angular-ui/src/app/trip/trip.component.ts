import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  @Output() displayTrip = new EventEmitter();
  displayCreateTrip = false;
  displayManageTrips = false;
  currentTrip: Trip;


  constructor(private messageService: MessageService,
              private http: Http,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const deviceId = +params['deviceId'];
      this.http.get(environment.baseUrl + `devices/${deviceId}/currentTrip`).subscribe(
        resp => {
          this.currentTrip = {
            'tripId': resp.json().id,
            'deviceId': resp.json().device.id,
            'description': resp.json().description,
            'startTime': new Date(resp.json().startTime)
          };
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Request Error',
            detail: error.json().message
          });
        }
      );
    });
  }

  createTrip() {
    this.displayCreateTrip = true;
  }

  closeCreateTrip(state) {
    if (state) {
      this.messageService.add({severity: 'success', summary: 'Trip Created'});
      this.ngOnInit();
    } else {
      this.messageService.add({severity: 'warn', summary: 'Did not create trip'});
    }
    this.displayCreateTrip = false;
  }

  manageTrips() {
    this.displayManageTrips = true;
  }

  closeManageTrips() {
    this.displayManageTrips = false;
  }

  notifyGmap(tripId) {
    this.displayTrip.emit(tripId);
    this.closeManageTrips();
  }

  endTrip(id) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});
    this.http.post(environment.baseUrl + `trips/${id}/endTrip`, options).subscribe(
      () => {
      },
      (error) => this.messageService.add({
        severity: 'error',
        summary: 'Request Error',
        detail: error.json().message
      }),
      () => {
        this.currentTrip = null;
      }
    );
  }

}

export interface Trip {
  tripId: number;
  deviceId: number;
  description: string;
  startTime: Date;
}
