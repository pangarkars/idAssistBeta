import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnvServiceService {
  env: any;
  constructor(private http: HttpClient) {}

  getEnv(): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append(
      'Accept',
      'application/vnd.heroku+json; version=3'
    );

    console.log('trying to get heroku env...');
    this.env = this.http.get(
      'https://api.heroku.com/apps/idassistbeta1/config-vars',
      {
        headers: headers,
      }
    );
    console.log(this.env);
    return this.env;
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
