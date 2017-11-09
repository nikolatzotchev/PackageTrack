import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  Http, Request, RequestOptionsArgs, RequestOptions,
  Response, Headers, ConnectionBackend, XHRBackend, JSONPBackend
} from '@angular/http';
import {MessageService} from 'primeng/components/common/messageservice';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  @Output() notifyTrip = new EventEmitter<boolean>();
  tripDescription: string;
  deviceId: any;

  constructor(private http: Http,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
  }

  closeDialog() {
    this.notifyTrip.emit(false);
  }

  createTrip() {
    this.activatedRoute.params.subscribe(params => {
      this.deviceId = +params['deviceId'];
    });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    // push device id and description
    const data = {'deviceId': this.deviceId, 'description': this.tripDescription};
    this.http.post(environment.baseUrl + 'trips', JSON.stringify(data), options)
    .subscribe(
      () => {
      },
    (error) => {
      this.messageService.add({severity: 'error', summary: 'Request Error', detail: error.json().message});
    },
      () => this.notifyTrip.emit(true)
    );
  }

}
