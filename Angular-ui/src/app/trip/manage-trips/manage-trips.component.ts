import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import 'rxjs/add/operator/toPromise';
import {TripService, Trip} from '../../services/trip/trip.service';
import {DeviceService} from '../../services/device/device.service';

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
  displayTrips = false;
  emptyMessage = 'There are currently no finished trips!';

  constructor(private tripService: TripService,
              private deviceService: DeviceService,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.deviceId = +params['deviceId'];
    });
    this.getEndedTrips();
  }

  getEndedTrips() {
    this.deviceService.getEndedTrips(this.deviceId)
    .finally(() => this.displayTrips = true)
    .subscribe(
      data => {
        data.forEach(trip => {
          this.endedTrips.push({
            'id': trip.id,
            'device': trip.device,
            'description': trip.description,
            'startTime': new Date(trip.startTime),
            'endTime': new Date(trip.endTime)
          });
        });
      }
    );
  }

  closeDialog() {
    this.notifyTrip.emit();
  }

  displayTrip(trip) {
    this.notifyGmap.emit(trip);
  }

  deleteTrip(trip) {
    this.tripService.deleteTrip(trip.id)
    .finally(
      () => {
        const index = this.endedTrips.indexOf(trip);
        if (index !== -1) {
          this.endedTrips.splice(index, 1);
        }
      }
    )
    .subscribe(
      data => {
        this.messageService.add({
          severity: 'success',
          summary: `trip has been deleted`
        });
      }
    );
  }
  dateToLocalString(date) {
    return date.toLocaleString();
  }
}
