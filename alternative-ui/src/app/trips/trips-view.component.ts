import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

// primeng
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { MenuItem, GMapModule} from 'primeng/primeng';

// env
import { environment } from '../../environments/environment';

declare var google: any;


const METRICS = [
    { 'Temperature': '°C' },
    { 'Humidity': '%' }
]

@Component({
  selector: 'app-trips-view',
  templateUrl: './trips-view.component.html',
  styleUrls: ['./trips-view.component.css']
})
export class TripsViewComponent implements OnInit, OnDestroy {

  private sub: any;
  breadcrumb: Array<MenuItem> = [
    { label: 'Devices', routerLink: '/devices' }
  ];

  trip: any;
  tripConfigs: any[];


  constructor(private http: Http, private messageService: MessageService, private route: ActivatedRoute) {}

  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
         let tripId = +params['tripId']; // (+) converts string 'id' to a number
         // load trip information & setup navigation
         this.loadTrip(tripId);

         // load trip configuration
         this.http.get( environment.baseUrl + `trips/${tripId}/configurations`).subscribe(
             res => this.tripConfigs = res.json()
         );

      });
  }

  private loadTrip(tripId) {
      this.http.get( environment.baseUrl + `trips/${tripId}`).subscribe(
          res => {
              this.trip = res.json();
              let deviceId = this.trip.device.id;
              // add navigation
              if (this.breadcrumb.length === 1) {
                  this.breadcrumb.push( { label: this.trip.device.serialNo, routerLink: `/devices/${deviceId}`});
                  this.breadcrumb.push( { label: `Trip #${tripId}`, routerLink: `/trips/${tripId}`});
              }
          },
          err => this.messageService.add({severity:'error', summary:'Request Failed', detail:err})
      );
  }

  ngOnDestroy() {
   this.sub.unsubscribe();
  }

  setGMap(event) {
      // TOOD: load the map
  }

  startTrip() {
      this.tripAction('startTrip');
  }

  stopTrip() {
      this.tripAction('endTrip');
  }

  private tripAction(action: string) {
      this.http.post(environment.baseUrl + `trips/${this.trip.id}/${action}`, this.trip.id).subscribe(
          res => this.loadTrip(this.trip.id),
          err => this.messageService.add({severity:'error', summary:'Request Failed', detail:err})
      );
  }


}
