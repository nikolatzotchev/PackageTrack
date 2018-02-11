import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {ActivatedRoute} from '@angular/router';
import {TripService, Trip} from '../services/trip/trip.service';
import {DeviceService} from '../services/device/device.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  @Output() displayTrip = new EventEmitter<number>();
  displayCreateTrip = false;
  displayManageTrips = false;
  currentTrip: Trip;


  constructor(private messageService: MessageService,
              private tripService: TripService,
              private deviceService: DeviceService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const deviceId = +params['deviceId'];
      this.deviceService.checkCurrentTrip(deviceId).subscribe(
        data => {
          this.currentTrip = {
            'id': data.id,
            'device': data.device,
            'description': data.description,
            'startTime': new Date(data.startTime),
            'endTime': null
          };
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
    this.tripService.endTrip(id).subscribe(
      () => this.currentTrip = null,
    );
  }
}
