import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';

// primeng
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { MenuItem} from 'primeng/primeng';
// env
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit, OnDestroy {

  private sub: any;
  breadcrumb: Array<MenuItem> = [
    { label: 'Devices', routerLink: '/devices' }
  ];

  serialNo: string;

  trips: any[];

  constructor(
      private http: Http,
      private messageService: MessageService,
      private route: ActivatedRoute,
      private router: Router) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       let deviceId = +params['deviceId']; // (+) converts string 'id' to a number
       this.http.get( environment.baseUrl + `devices/${deviceId}/trips`).subscribe(
           res => {
               this.trips = res.json();
               this.serialNo = this.trips[0].device.serialNo;
               // add navigation
               this.breadcrumb.push( { label: this.serialNo, routerLink: `/devices/${deviceId}`});
           },
           err => this.messageService.add({severity:'error', summary:'Request Failed', detail:err})
       )

       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  selectTrip(trip) {
    this.router.navigate(['/trips', trip.id]);
  }

}
