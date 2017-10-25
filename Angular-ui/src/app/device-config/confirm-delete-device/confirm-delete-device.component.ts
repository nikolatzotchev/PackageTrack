import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-delete-device.component.html',
    styleUrls: ['./confirm-delete-device.component.css']
  })
  export class ConfirmDeleteDeviceComponent implements OnInit {
    confirm: boolean;
    ngOnInit() {
    }

    constructor(
      public dialogRef: MatDialogRef<ConfirmDeleteDeviceComponent>) { }

    confirmDeletion() {
        this.confirm = true;
        this.dialogRef.close();
    }

    onNoClick(): void {
      this.confirm = false;
      this.dialogRef.close();
    }
}
