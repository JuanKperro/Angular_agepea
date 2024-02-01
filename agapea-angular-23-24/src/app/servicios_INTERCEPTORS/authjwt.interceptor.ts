import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable , switchMap, concatMap} from 'rxjs';
import { MI_TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservices';
import { IStorageService } from '../modelos/interfaceservicios';

@Injectable()
export class AuthjwtInterceptor implements HttpInterceptor {

  constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc: IStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.storageSvc.RecuperarJWT().pipe(
      concatMap(
      (jwt:string) => {
        if (jwt != null || jwt != ''){
          let _reqclonada= request.clone(
          {setHeaders: {Authorization: `Bearer ${jwt}`}}
          
        );
        return next.handle(_reqclonada);
        } else {
          return next.handle(request);
        }
        
      }
      )
    );
    
  }
}
