import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable , first, map  } from 'rxjs';
import { inject} from '@angular/core';
import { MI_TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservices';

 

export const guardv17Guard: CanActivateFn = 
(route: ActivatedRouteSnapshot
, state: RouterStateSnapshot): Observable<boolean | UrlTree> 
| Promise<boolean | UrlTree> | boolean | UrlTree => {

  let url:  UrlTree = inject(Router).createUrlTree(['/Cliente/Login']); 
  return  inject(MI_TOKEN_SERVICIOSTORAGE).RecuperarDatosCliente().pipe(
        first(),
        map( datos => datos != null ? true : url )
          );
};
