import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service'
import { ServerService } from './server.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private serverService: ServerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serverUrl = this.serverService.getServerUrl();
    // Get the auth header from the service.
    const authHeader = this.authService.getToken();
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('x-access-token', authHeader), url: serverUrl + req.url});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
