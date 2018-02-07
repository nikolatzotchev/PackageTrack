import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MessageService} from 'primeng/components/common/messageservice';
import {ErrorService} from '../error.service';
import { catchError, retry } from 'rxjs/operators';



@Injectable()
export class TripService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getTripReports(tripId: number) {
    return this.http.get<Report[]>(environment.baseUrl + `trips/${tripId}/reports`)
      .pipe(
        retry(3), // retry a failed request up to 3 times

      );
  }

  endTrip(tripId) {
    return this.http.post(environment.baseUrl + `trips/${tripId}/endTrip`, this.httpOptions)
      .pipe(
        retry(3),

      );
  }

  deleteTrip(tripId: number) {
    return this.http.delete(environment.baseUrl + `trips/${tripId}/deleteTrip`)
      .pipe(
        retry(3),

      );
  }

  createTrip(trip) {
    return this.http.post<Trip>(environment.baseUrl + 'trips', JSON.stringify(trip), this.httpOptions)
      .pipe(
        retry(3),

      );
  }

  setRanges(tripId: number, data) {
    return this.http.post(environment.baseUrl + `trips/${tripId}/configurations`,
      JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(3),

    );
  }

  startTrip(tripId) {
    return this.http.post(environment.baseUrl + `trips/${tripId}/startTrip`, this.httpOptions)
      .pipe(
        retry(3),

      );
  }
}

export interface Trip {
  id;
  device;
  description;
  startTime;
  endTime;
}

export interface Report {
  latitude;
  longitude;
  timestamp;
  incidentValues;
}
