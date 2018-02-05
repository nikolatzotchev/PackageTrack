import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Observable} from 'rxjs/Rx';
import {TripService} from '../../services/trip/trip.service';

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

  constructor(private tripService: TripService,
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
    // push device id and description
    const trip = {'deviceId': this.deviceId, 'description': this.tripDescription};
    this.tripService.createTrip(trip).subscribe(
      data => {
        const tripId = data.id;
        this.setRangesAndStart(tripId);
      }
    );
  }

  setRangesAndStart(tripId) {
    Observable.forkJoin(
      // setting range for temperature
      this.tripService.setRanges(tripId, this.getConfig('Temp')),
      // setting range for humidity
      this.tripService.setRanges(tripId, this.getConfig('Humid')),
      this.tripService.startTrip(tripId)
    ).finally(() => this.notifyTrip.emit(true)).subscribe();
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
