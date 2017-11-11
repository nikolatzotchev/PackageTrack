import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  @Output() displayTrip = new EventEmitter();
  displayCreateTrip = false;
  displayManageTrips = false;

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
  }

  createTrip() {
    this.displayCreateTrip = true;
  }

  closeCreateTrip(state) {
    if (state) {
      this.messageService.add({severity: 'success', summary: 'Trip Created'});
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

}
