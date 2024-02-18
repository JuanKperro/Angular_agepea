import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {  HttpRequest} from '@angular/common/http';
import {  concatMap, first} from 'rxjs';
import { MI_TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservices';

export const authjwtv17Interceptor: HttpInterceptorFn = (req:  HttpRequest<unknown>, next: HttpHandlerFn) => {
  return inject(MI_TOKEN_SERVICIOSTORAGE).RecuperarJWT().pipe(
  first(),
    concatMap(
      (jwt:string) => {
        console.log('ejecutando interceptor...');
        if (jwt != null || jwt != ''){
          let _reqclonada= req.clone(
          {setHeaders: {Authorization: `Bearer ${jwt}`}}
          
        );
        return next(_reqclonada);
        } else {
          return next(req);
        }
        
      }
      )
  );
};
