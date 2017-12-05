import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import {environment} from '../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-manage-trips',
  templateUrl: './manage-trips.component.html',
  styleUrls: ['./manage-trips.component.css']
})
export class ManageTripsComponent implements OnInit {
  @Output() notifyTrip = new EventEmitter();
  @Output() notifyGmap = new EventEmitter<number>();
  endedTrips: Trip[] = [];
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
    this.getEndedTrip();
  }

  getEndedTrip() {
    this.http.get(environment.baseUrl + `devices/${this.deviceId}/endedTrips`).subscribe(
      (resp) => {
        resp.json().forEach(trip => {
          this.endedTrips.push({
            'tripId': trip.id,
            'deviceId': trip.device.id,
            'description': trip.description,
            'startTime': new Date(trip.startTime),
            'endTime': new Date(trip.endTime)
          });
        });
      },
      (error) => this.messageService.add({
        severity: 'error',
        summary: 'Request Error',
        detail: error.json().message
      }),
      () => this.display = true
    );
  }

  closeDialog() {
    this.notifyTrip.emit();
  }

  displayTrip(trip) {
    this.notifyGmap.emit(trip.tripId);
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
