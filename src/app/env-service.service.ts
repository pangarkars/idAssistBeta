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
    console.log('trying to get heroku env...');
    this.env = this.http.get(
      'https://api.heroku.com/apps/name-of-app/config-vars'
    );
    console.log(this.env);
    return this.env;
  }
}
