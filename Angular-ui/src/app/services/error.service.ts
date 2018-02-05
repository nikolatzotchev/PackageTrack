import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {MessageService} from 'primeng/components/common/messageservice';

@Injectable()
export class ErrorService {

  constructor(private messageService: MessageService) { }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('131231');
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Request Error',
      //   detail: 'An error occurred:'
      // });
    } else {
      console.log('aaaaa');
      this.messageService.add({
        severity: 'error',
        summary: 'Request Error',
        detail: 'An error occurred:'
      });
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened; please try again later.');
  }
}
