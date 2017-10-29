import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.css']
})
export class ErrorHandlingComponent implements OnInit {

  constructor (public dialogRef: MatDialogRef<ErrorHandlingComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

}
