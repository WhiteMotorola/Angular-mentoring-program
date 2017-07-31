import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, Request, RequestOptions, RequestMethod, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService {

  private loginUrl: string = 'login';

  @Output() authTokenEvent: EventEmitter <string> = new EventEmitter();
  @Output() loginUserEvent: EventEmitter <string> = new EventEmitter();

  constructor (private http: Http) {

  }

  public login (user: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.loginUrl, user, options)
      .map((res) => res.json())
      .map((data) => {
        let expireTime = Date.now() + data.expiresIn * 1000;
        sessionStorage.setItem('expire_token_time', expireTime.toString());
        sessionStorage.setItem('oauth_token', data.token.accessToken);
        sessionStorage.setItem('username', data.user.username);
        this.authTokenEvent.emit();
      })
      .catch((error) => {
        if (error.status === 401) {
          return Observable.throw('Unauthorized');
        }
      });
  }

  public isExpired () {
    return Date.now() - parseInt(sessionStorage.getItem('expire_token_time')) >= 0;
  }

  public getUserInfo () {
    return sessionStorage.getItem('username');
  }

  public logout () {
    sessionStorage.setItem('oauth_token', 'logouted');
    sessionStorage.removeItem('username');
    this.authTokenEvent.emit();
  }

  public isAuthenticated () {
    return sessionStorage.getItem('oauth_token') && sessionStorage.getItem('oauth_token') !== 'logouted';
  }
}