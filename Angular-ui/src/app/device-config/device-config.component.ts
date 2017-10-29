import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';

import 'rxjs/add/operator/map';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SetDeviceDialogComponent } from './set-device-config/set-device-config.component';
import { DeleteDeviceDialogComponent } from './delete-device-dialog/delete-device-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.css'],
  providers: [SetDeviceDialogComponent]
})
export class DeviceConfigComponent implements OnInit {

  msgs: Message[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  setDevice(): void {
    const dialogRef = this.dialog.open(SetDeviceDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Device Set' });
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Did not set device' });
      }
    });
  }

  deleteDevice(): void {
    const dialogRef = this.dialog.open(DeleteDeviceDialogComponent, {
    });
  }
}
