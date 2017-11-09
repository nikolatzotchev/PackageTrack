import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Message } from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';

import { CreateTripComponent } from './create-trip/create-trip.component';
import { StartTripComponent } from './start-trip/start-trip.component';
import { ManageTripsComponent } from './manage-trips/manage-trips.component';

import {ButtonModule} from 'primeng/primeng';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  @Output() displayTrip = new EventEmitter();

  msgs: Message[] = [];
  displayCreateTrip = false;
  displayStartTrip = false;

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

  startTrip() {
    this.displayStartTrip = true;
  }

  manageTrips() {

  }

}
