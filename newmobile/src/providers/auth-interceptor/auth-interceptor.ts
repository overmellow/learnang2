import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthProvider } from '../auth/auth'
import { ServerProvider } from '../server/server'

@Injectable()
export class AuthInterceptorProvider implements HttpInterceptor {

  constructor(
    private authProvider: AuthProvider,
    private serverProvider: ServerProvider
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serverUrl = this.serverProvider.getServerUrl();
    // Get the auth header from the service.
    const authHeader = this.authProvider.getToken();
    //const authHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTliMzE2ODcwMTc2MTUzNTcwNDI3Y2U2Iiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsibXlDb252ZXJzYXRpb25zIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJwYXNzd29yZCI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJuYW1lIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwibXlDb252ZXJzYXRpb25zIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwiZW1haWwiOnRydWUsIm5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sInBhdGhzVG9TY29wZXMiOnt9LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6eyJzYXZlIjpbbnVsbCxudWxsXSwiaXNOZXciOltudWxsLG51bGxdfSwiX2V2ZW50c0NvdW50IjoyLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJteUNvbnZlcnNhdGlvbnMiOlt7ImNvbnZlcnNhdGlvbiI6IjU5YjMxYWZhMDA0MjEyMzhlNWRmNzUyOSIsIl9pZCI6IjU5YjMxYWZhMDA0MjEyMzhlNWRmNzUyYSIsInNlZW4iOiJzZW50In1dLCJfX3YiOjEsImNvbnZlcnNhdGlvbnMiOltdLCJwYXNzd29yZCI6IjEwMDAiLCJlbWFpbCI6Im1vcmlAbWFpbC5jb20iLCJuYW1lIjoibW9yaSIsIl9pZCI6IjU5YjMxNjg3MDE3NjE1MzU3MDQyN2NlNiJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTA0OTEyMzg0fQ.GgdgaQs5T0lyG2PXdrOARcMHvG2u_7ifgml6aMGIgzg';
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('x-access-token', authHeader), url: serverUrl + req.url});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
