import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http, RequestOptions, Headers} from '@angular/http';
import {MessageService} from 'primeng/components/common/messageservice';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  @Output() notifyTrip = new EventEmitter<boolean>();
  tripDescription: string;
  deviceId: any;
  rangeTemperatureValues: number[] = [5, 25];
  rangeHumidityValues: number[] = [30, 80];

  constructor(private http: Http,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
  }

  closeDialog() {
    this.notifyTrip.emit(false);
  }

  createTrip() {
    // get device id
    this.activatedRoute.params.subscribe(params => {
      this.deviceId = +params['deviceId'];
    });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});
    // push device id and description
    const data = {'deviceId': this.deviceId, 'description': this.tripDescription};
    this.http.post(environment.baseUrl + 'trips', JSON.stringify(data), options)
    .subscribe(
      (response) => {
        const tripId = response.json().id;
        this.setRangesAndStart(tripId, options);
      },
      (error) => {
        // display error message
        this.messageService.add({
          severity: 'error',
          summary: 'Request Error',
          detail: error.json().message
        });
      },
      () => this.notifyTrip.emit(true)
    );
  }

  setRangesAndStart(tripId, options) {
    Observable.forkJoin(
      this.http.post(environment.baseUrl + `trips/${tripId}/configurations`,
        JSON.stringify(this.getConfig('Temp')), options),
      // setting range for humidity
      this.http.post(environment.baseUrl + `trips/${tripId}/configurations`,
        JSON.stringify(this.getConfig('Humid')), options),
      // start the trip if wanted
      this.http.post(environment.baseUrl + `trips/${tripId}/startTrip`, options)
    ).subscribe(
      () => {},
      (error) => {
        // display error message
        this.messageService.add({
          severity: 'error',
          summary: 'Request Error',
          detail: error.json().message
        });
      }
    );
  }

  getConfig(opt): any {
    if (opt === 'Temp') {
      return {
        'metric': 'Temperature',
        'min': this.rangeTemperatureValues[0],
        'max': this.rangeTemperatureValues[1]
      };
    } else if (opt === 'Humid') {
      return {
        'metric': 'Humidity',
        'min': this.rangeHumidityValues[0],
        'max': this.rangeHumidityValues[1]
      };
    }
  }

}
