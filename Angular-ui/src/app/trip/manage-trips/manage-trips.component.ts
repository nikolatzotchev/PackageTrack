import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import {environment} from '../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-manage-trips',
  templateUrl: './manage-trips.component.html',
  styleUrls: ['./manage-trips.component.css']
})
export class ManageTripsComponent implements OnInit {
  @Output() notifyTrip = new EventEmitter();
  endedTrips: Trip[] = [];
  currentTrip: Trip;
  deviceId: number;
  display = false;

  constructor(private http: Http,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.deviceId = +params['deviceId'];
    });
    this.getCurrentTrip();
    this.getEndedTrip();
    // needed for dialog to be centered ugly solution but nothing else works
    setTimeout(() => {
      this.display = true;
    }, 50);
  }

  getCurrentTrip() {
    this.http.get(environment.baseUrl + `devices/${this.deviceId}/currentTrip`).subscribe(
      resp => {
        this.currentTrip = {
          'tripId': resp.json().id,
          'deviceId': resp.json().device.id,
          'description': resp.json().description,
          'startTime': new Date(resp.json().startTime * 1000),
          'endTime': null
        };
      },
      (error) => this.messageService.add({
        severity: 'error',
        summary: 'Request Error',
        detail: error.json().message
      }),
    );
  }

  getEndedTrip() {
    this.http.get(environment.baseUrl + `devices/${this.deviceId}/endedTrips`).subscribe(
      resp => {
        resp.json().forEach(trip => {
          this.endedTrips.push({
            'tripId': trip.id,
            'deviceId': trip.device.id,
            'description': trip.description,
            'startTime': new Date(trip.startTime * 1000),
            'endTime': new Date(trip.endTime * 1000)
          });
        });
      }
    );
  }

  closeDialog() {
    this.notifyTrip.emit();
  }

  displayTrip() {

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
        this.getEndedTrip();
      }
    );
  }

  deleteTrip(trip) {
    this.http.delete(environment.baseUrl + `trips/${trip.tripId}/deleteTrip`).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: `trip ${trip.tripId} has been deleted`
        });
      },
      (error) => this.messageService.add({
        severity: 'error',
        summary: 'Request Error',
        detail: error.json().message
      }),
      () => {
        const index = this.endedTrips.indexOf(trip);
        if (index !== -1) {
          this.endedTrips.splice(index, 1);
        }
      }
    );
  }

  dateToLocalString(date) {
    return date.toLocaleString();
  }

}

export interface Trip {
  tripId: number;
  deviceId: number;
  description: string;
  startTime: Date;
  endTime: Date;
}
