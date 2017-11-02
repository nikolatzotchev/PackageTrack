import { Component, OnInit, Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs, RequestOptions,
    Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend } from '@angular/http';
import { GMapModule } from 'primeng/primeng';

import { TimerObservable } from 'rxjs/observable/TimerObservable';


declare var google: any;

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css']
})
export class DeviceViewComponent implements OnInit {

  // google maps
  options: any;
  overlays: any[];
  gmap: any;
  infoWindow: any;

  // own data
  deviceInfo: any;
  path = [];

  constructor(private http: Http) { }

  setGMap(event) {
      this.gmap = event.map;
  }

  displayTrip(tripId) {
    console.log(tripId);
    this.http.get(`http://192.168.1.107:8080/api/v1/trips/${tripId}/reports`)
            .subscribe(
                response => {
                    const res = response.json();
                    res.forEach(element => {
                        console.log(element);
                        if (element.incidentValues.length !== 0) {
                            console.log('asfasfa');
                        }
                        this.path.push({'lat': element.latitude, 'lng': element.longitude});
                    });
                },
                (err) => (console.log(err)),
                () => {
                    const flightPath = new google.maps.Polyline({
                    path: this.path,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                flightPath.setMap(this.gmap);
            }
            );
  }

  ngOnInit() {
        this.http.get('/api/data/path/1').subscribe(
        // this.http.get('/assets/device.json').subscribe(
          response => {
              const j = response.json();
              const bounds = new google.maps.LatLngBounds();
              if (j.Incidends) {
                  this.overlays = j.Incidends.map(incident => {
                      const marker = this.toMarker(incident);
                      bounds.extend(marker.getPosition());
                      return marker;
                  });

              }

              if (j.Current) {
                  const current = this.toMarker(j.Current);
                  current.setAnimation(google.maps.Animation.BOUNCE);
                  current.setIcon('/assets/map-pin-17.png');
                  bounds.extend(current.getPosition());
                  this.overlays.push(current);
                  this.gmap.setCenter(current.getPosition());
              }

              if (j.Path) {
                  const flightPath = new google.maps.Polyline({
                      path: j.Path,
                      geodesic: true,
                      strokeColor: '#FF0000',
                      strokeOpacity: 1.0,
                      strokeWeight: 2
                  });
                  flightPath.setMap(this.gmap);
              }

              // center the map to see all the overlays
              setTimeout( () => { // map will need some time to load
                  this.gmap.fitBounds(bounds); // Map object used directly
              }, 1000);
              this.deviceInfo = j.Path[0].lng; // JSON.stringify(j.Path, null , 2);
          },
          error => {
              console.log(error);
          }
      );
      this.options = {
          center: {lat: 0, lng: 0},
          zoom: 8
      };

      this.infoWindow = new google.maps.InfoWindow();
      // TimerObservable.create(0, 1000).subscribe(() => console.log(1));
  }

  private toMarker(incident): any {
      const location = incident.Location;
      return new google.maps.Marker(
          {
              position: {
                  lat: location.Latitude,
                  lng: location.Longitude
              },
              animation: google.maps.Animation.DROP,
              customInfo: incident
          });
  }

  handleOverlayClick(event) {
      const incident = event.overlay.customInfo;
      this.infoWindow.setContent('<h1>Sensor Information:</h1><pre>' + incident.Temperature.SensorValue + '</pre>');
      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());
  }
}
