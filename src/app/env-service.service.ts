import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnvServiceService {
  env: any;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getEnv(): Observable<any> {
    console.log('trying to get heroku env...');
    //var url = window.location.origin;
    var url = 'http://localhost:8080';
    return this.http.get(url + '/backendKey').pipe(map((response) => response));
  }

  getEnv1(): Observable<any> {
    console.log('trying to communicate with node');
    //var url = window.location.origin;
    var url = 'http://localhost:8080';
    return this.http.get(url + '/dowork').pipe(map((response) => response));
  }

  getSecretKey(): Observable<any> {
    this.httpHeaders = this.httpHeaders.append(
      'Accept',
      'application/vnd.heroku+json; version=3'
    );
    let API_URL = 'https://api.heroku.com/apps/idassistbeta1/config-vars';
    return this.http.get(API_URL, { headers: this.httpHeaders }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      errorMessage;
    });
  }

  getKEyFromNode(): Observable<any> {
    //const url = `${window.location.origin}/config-vars`;

    var url = 'http://localhost:8080/config-vars';
    return this.http
      .get(url, { responseType: 'text' })
      .pipe(map((response: any) => response));
  }
  /*   getToken(){
    this.http
      .get(window.location.origin + '/backend')
      .map((response: Response) => response.json())
      .subscribe(
        (urlBackend) => {
          sessionStorage.setItem('url_backend', urlBackend.url);
        },
        () => {
          console.log('CanÂ´t find the backend URL, using a failover value');
          sessionStorage.setItem('url_backend', 'https://failover-url.com');
        }
      );
  } */
}
