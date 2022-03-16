import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const baseUrl = 'http://localhost:8080/api/idassists';

@Injectable({
  providedIn: 'root',
})
export class EnvServiceService {
  env: any;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getEnv(): Observable<any> {
    console.log('trying to get heroku env...');
    return this.http
      .get(window.location.origin + '/backendKey')
      .pipe(map((response) => response));
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
      })
    );
  }

  getKEyFromNode(): Observable<any> {
    const url = `${window.location.origin}/config-vars`;
    return this.http
      .get(url, { responseType: 'text' })
      .pipe(map((response: any) => response));
  }

  createRecord(data: any): Observable<any> {
    return this.http.post('/api/idassists', data);
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
