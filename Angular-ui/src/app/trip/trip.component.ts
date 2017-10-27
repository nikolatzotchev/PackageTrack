import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Message } from 'primeng/components/common/api';

import { CreateTripComponent } from './create-trip/create-trip.component';
@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  msgs: Message[] = [];

  ngOnInit() {
  }

  createTrip() {
    const dialogRef = this.dialog.open(CreateTripComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Trip Created' });
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Did not create trip' });
      }
    });
  }

}
