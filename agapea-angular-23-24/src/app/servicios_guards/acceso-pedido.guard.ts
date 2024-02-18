import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot,Router, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, last, map } from 'rxjs';
import { IStorageService } from '../modelos/interfaceservicios';
import { MI_TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservices';
import { ICliente } from '../modelos/cliente';




@Injectable({
  providedIn: 'root'
})
export class AccesoPedidoGuard implements CanActivateChild {

  
  constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc: IStorageService
  , private router: Router) { }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return  this.storageSvc.RecuperarDatosCliente().pipe(

        map( datos => datos != null ? true : this.router.createUrlTree(['/Cliente/Login']) )
          );
  }
  
}
