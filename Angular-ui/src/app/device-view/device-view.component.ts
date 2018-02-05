import {Component, OnInit, Injectable, Input} from '@angular/core';

import {MessageService} from 'primeng/components/common/messageservice';
import {TripService} from '../services/trip/trip.service';
import {DeviceService} from '../services/device/device.service';

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

  constructor(private messageService: MessageService,
              private tripService: TripService,
              private deviceService: DeviceService) {
  }

  private static toMarker(incident): any {
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

  setGMap(event) {
    this.gmap = event.map;
  }

  displayTrip(tripId) {
    this.tripService.getTripReports(tripId)
    .finally(
      () => {
        const tripPath = new google.maps.Polyline({
          path: this.path,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        this.overlays.push(tripPath);
    })
    .subscribe(
      data => {
        this.path = [];
        this.overlays = [];

        const bounds = new google.maps.LatLngBounds();

        data.forEach(element => {
          if (element.incidentValues.length !== 0) {
            const marker = DeviceViewComponent.toMarker(element);
            this.overlays.push(marker);
          }
          const position = {'lat': element.latitude, 'lng': element.longitude};
          this.path.push(position);
          bounds.extend(position);
          setTimeout(() => { // map will need some time to load
            this.gmap.fitBounds(bounds); // Make the whole trip visible on map.
          }, 1000);
        });
      }
    );
  }

  ngOnInit() {
    this.deviceService.checkCurrentTrip(this.deviceId).subscribe(
      data => {
        this.displayTrip(data.id);
        this.tripDescription = data.description;
      }
    );
    this.options = {
      center: {lat: 0, lng: 0},
      zoom: 8
    };
    this.infoWindow = new google.maps.InfoWindow();
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
