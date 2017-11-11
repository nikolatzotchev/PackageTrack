import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
@Component({
  selector: 'app-manage-trips',
  templateUrl: './manage-trips.component.html',
  styleUrls: ['./manage-trips.component.css']
})
export class ManageTripsComponent implements OnInit {
  @Output() notifyTrip = new EventEmitter();

  constructor(private http: Http) {
  }

  ngOnInit() {
  }

  closeDialog() {
    this.notifyTrip.emit();
  }
}
