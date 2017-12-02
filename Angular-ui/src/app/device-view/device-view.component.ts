import {Component, OnInit, Injectable, Input} from '@angular/core';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import {GMapModule} from 'primeng/primeng';

import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {MenuItem} from 'primeng/primeng';
import {MessageService} from 'primeng/components/common/messageservice';

import {environment} from '../../environments/environment';


declare var google: any;

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css']
})
export class DeviceViewComponent implements OnInit {

  // google maps
  options: any;
  overlays: any[] = [];
  gmap: any;
  infoWindow: any;

  // own data
  path = [];
  tripDescription: string;

  // inputs
  @Input() deviceId: any;

  constructor(private http: Http, private messageService: MessageService) {
  }

  setGMap(event) {
    this.gmap = event.map;
  }

  displayTrip(tripId) {
    this.http.get(environment.baseUrl + `trips/${tripId}/reports`)
    .subscribe(
      response => {
        this.path = [];
        this.overlays = [];

        const bounds = new google.maps.LatLngBounds();
        const res = response.json();
        // getting trip description to show displayed trip
        this.tripDescription = res[0].trip.description;

        res.forEach(element => {
          if (element.incidentValues.length !== 0) {
            const marker = this.toMarker(element)
            this.overlays.push(marker);
          }
          const position = {'lat': element.latitude, 'lng': element.longitude};
          this.path.push(position);
          bounds.extend(position);
          setTimeout(() => { // map will need some time to load
            this.gmap.fitBounds(bounds); // Make the whole trip visible on map.
          }, 1000);
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Request Error',
          detail: error.json().message
        });
      },
      () => {
        const tripPath = new google.maps.Polyline({
          path: this.path,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        this.overlays.push(tripPath);
      }
    );
  }

  ngOnInit() {
    this.http.get(environment.baseUrl + `devices/${this.deviceId}/currentTrip`).subscribe(
      (response) => {
        this.displayTrip(response.json().id);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Request Error',
          detail: error.json().message
        });
      },
    );
    this.options = {
      center: {lat: 0, lng: 0},
      zoom: 8
    };
    this.infoWindow = new google.maps.InfoWindow();
  }

  private toMarker(incident): any {
    return new google.maps.Marker(
      {
        position: {
          lat: incident.latitude,
          lng: incident.longitude
        },
        animation: google.maps.Animation.DROP,
        customInfo: incident
      });
  }

  handleOverlayClick(event) {
    const incident = event.overlay.customInfo;
    const incidentValues = incident.incidentValues;
    let metricContent = '';
    incidentValues.forEach(
      v => {
        metricContent = metricContent.concat(v.metric.toString())
        .concat(': ').concat(v.value.toString().concat('<br>'));
      }
    );
    this.infoWindow.setContent(
      '<span id="content">' + metricContent + '</span>'
    );
    this.infoWindow.open(event.map, event.overlay);
    event.map.setCenter(event.overlay.getPosition());
  }
}
