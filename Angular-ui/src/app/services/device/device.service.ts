import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MessageService} from 'primeng/components/common/messageservice';
import { catchError, retry } from 'rxjs/operators';

import {ErrorService} from '../error.service';
import {Trip} from '../trip/trip.service';


@Injectable()
export class DeviceService {

  constructor(private http: HttpClient,
              private messageService: MessageService, private errorService: ErrorService) { }

  setNewDevice(serialNum: string)  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

   return this.http.post(environment.baseUrl + 'devices', serialNum, httpOptions)
     .pipe(
       retry(3), // retry a failed request up to 3 times
       catchError(this.errorService.handleError) // then handle the error
     );
  }

  deleteDevice(id: Number) {
   return this.http.delete(environment.baseUrl + `devices/${id}`)
      .pipe(
        catchError(this.errorService.handleError) // handle the error
      );
  }

  getAllDevices() {
    // get all devices
    return this.http.get<Device[]>(environment.baseUrl + 'devices')
      .pipe(
        catchError(this.errorService.handleError)
      );
  }

  checkCurrentTrip(deviceId) {
    return this.http.get<Trip>(environment.baseUrl + `devices/${deviceId}/currentTrip`);
  }

  getDevice(deviceId) {
    return  this.http.get<Device>(environment.baseUrl + 'devices/' + `${deviceId}`)
      .pipe(
        catchError(this.errorService.handleError)
      );
  }

  getEndedTrips(deviceId: number) {
    return this.http.get<Trip[]>(environment.baseUrl + `devices/${deviceId}/endedTrips`)
      .pipe(
        retry(3),
        catchError(this.errorService.handleError)
      );
  }
}

export interface Device {
  id;
  serialNo;
  inATrip;
}
