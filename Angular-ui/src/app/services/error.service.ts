import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

//
// import { Injectable, ErrorHandler } from '@angular/core';
// import {HttpErrorResponse} from '@angular/common/http';
// import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {MessageService} from 'primeng/components/common/messageservice';

@Injectable()
export class ErrorService implements HttpInterceptor {

  constructor(public messageService: MessageService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .catch((response: any) => {
      if (response instanceof HttpErrorResponse) {
        console.log('response in the catch: ', response, this.messageService);
        this.messageService.add({
          severity: 'error',
          summary: 'Request Error',
          detail: `An error occurred: ${response.error.message}`
        });
      }
      return Observable.throw(response);
    });
  }

}
