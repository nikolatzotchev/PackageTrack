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

  constructor(private http: HttpClient,
  private messageService: MessageService, private errorService: ErrorService) { }

  getTripReports(tripId: number) {
    return this.http.get<Report[]>(environment.baseUrl + `trips/${tripId}/reports`)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.errorService.handleError) // handling the error
      );
  }

  endTrip(tripId) {
    return this.http.post(environment.baseUrl + `trips/${tripId}/endTrip`, this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.errorService.handleError)
      );
  }

  deleteTrip(tripId: number) {
    return this.http.delete(environment.baseUrl + `trips/${tripId}/deleteTrip`)
      .pipe(
        retry(3),
        catchError(this.errorService.handleError)
      );
  }

  createTrip(trip) {
    return this.http.post(environment.baseUrl + 'trips', JSON.stringify(trip), this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.errorService.handleError)
      );
  }

  setRanges(tripId: number, data) {
    return this.http.post(environment.baseUrl + `trips/${tripId}/configurations`,
      JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(3),
      catchError(this.errorService.handleError)
    );
  }

  startTrip(tripId) {
    return this.http.post(environment.baseUrl + `trips/${tripId}/startTrip`, this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.errorService.handleError)
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

