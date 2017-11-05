import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

// primeng
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { MenuItem} from 'primeng/primeng';
// env
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices: any[];
  breadcrumb: Array<MenuItem> = [
    { label: 'Devices', routerLink: '/devices' }
  ];

  showAddDeviceDialog = false;
  addDeviceSerial: string;

  constructor(private http: Http, private messageService: MessageService, private router: Router) { }

  ngOnInit() {
      this.http.get( environment.baseUrl + 'devices').subscribe(
        res => {
            this.devices = res.json();
            this.devices.forEach(d => {
                this.http.get(environment.baseUrl + `devices/${d.id}/lastTrip`).subscribe(
                    res => {
                        d.lastTrip = res.json();
                    }
                );
            })
        },
        err => this.messageService.add({severity:'error', summary:'Request Failed', detail:err})
      );
  }

  addDevice() {
     this.showAddDeviceDialog = false;
     this.http.post( environment.baseUrl + 'devices', this.addDeviceSerial).subscribe(
        res => this.ngOnInit(), // reload page
        err => this.messageService.add({severity:'error', summary:'Request Failed', detail:err})
     );
  }

  removeDevice(id: number) {
      this.http.delete( environment.baseUrl + `devices/${id}`).subscribe(
         res => this.ngOnInit(), // reload page
         err => this.messageService.add({severity:'error', summary:'Request Failed', detail:err})
      );
  }

  startTrip(deviceId: number) {
      this.http.post( environment.baseUrl + 'trips', { 'deviceId' : deviceId }).subscribe(
          res => {
              this.ngOnInit() //reload page
              this.router.navigate(['/devices', deviceId]);
          },
          err => this.messageService.add({severity:'error', summary:'Request Failed', detail:err})
      )
  }

  openTrip(deviceId: number) {
    this.router.navigate(['/devices', deviceId]);
  }

  startEnabled(d: any): boolean {
      let last = d.lastTrip;
      if (!last) { // no last trip - then ok
          return true;
      }
      // if not started or not ended - then we cannot start a new trip
      if (last.endTime === null || last.startTime === null) {
          return false;
      }
      return true;
  }

}
