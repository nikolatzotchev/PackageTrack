import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {Trip} from '../trip/trip.service';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class DeviceService {

  constructor(private http: HttpClient) {
  }

  setNewDevice(serialNum: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post<Device>(environment.baseUrl + 'devices', serialNum, httpOptions)
    .retry(3); // retry a failed request up to 3 times
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
    return this.http.get<Device>(environment.baseUrl + 'devices/' + `${deviceId}`)
    .retry(3);
  }

  getEndedTrips(deviceId: number) {
    return this.http.get<Trip[]>(environment.baseUrl + `devices/${deviceId}/endedTrips`)
    .retry(3);
  }
}

export interface Device {
  id;
  serialNo;
  inATrip;
}
