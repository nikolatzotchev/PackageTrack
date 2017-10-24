import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './device-dialog-config.component.html',
    styleUrls: ['./device-dialog-config.component.css']
  })
  export class ConfirmDeleteComponent implements OnInit {
    confirm: boolean;
    ngOnInit() {
    }

    constructor(
      public dialogRef: MatDialogRef<ConfirmDeleteComponent>) { }

    confirmDeletion() {
        this.confirm = true;
        this.dialogRef.close();
    }

    onNoClick(): void {
      this.confirm = false;
      this.dialogRef.close();
    }
}
