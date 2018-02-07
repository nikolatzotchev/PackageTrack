import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MessageService} from 'primeng/components/common/messageservice';
import { catchError, retry } from 'rxjs/operators';

import {ErrorService} from '../error.service';
import {Trip} from '../trip/trip.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class DeviceService {

  constructor(private http: HttpClient) { }

  setNewDevice(serialNum: string)  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

   return this.http.post<Device>(environment.baseUrl + 'devices', serialNum, httpOptions)
     .pipe(
       retry(3), // retry a failed request up to 3 times
     );
  }

  deleteDevice(id: Number): Observable<any> {
   return this.http.delete<Device>(environment.baseUrl + `devices/${id}`);
  }

  getAllDevices() {
    // get all devices
    return this.http.get<Device[]>(environment.baseUrl + 'devices');
  }

  checkCurrentTrip(deviceId) {
    return this.http.get<Trip>(environment.baseUrl + `devices/${deviceId}/currentTrip`);
  }

  getDevice(deviceId) {
    return  this.http.get<Device>(environment.baseUrl + 'devices/' + `${deviceId}`)
      .pipe(

      );
  }

  getEndedTrips(deviceId: number) {
    return this.http.get<Trip[]>(environment.baseUrl + `devices/${deviceId}/endedTrips`)
      .pipe(
        retry(3),

      );
  }
}

export interface Device {
  id;
  serialNo;
  inATrip;
}
