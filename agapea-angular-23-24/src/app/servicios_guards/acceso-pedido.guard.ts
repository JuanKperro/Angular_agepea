import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot,Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, last, map , take,first} from 'rxjs';
import { IStorageService } from '../modelos/interfaceservicios';
import { MI_TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservices';
import { ICliente } from '../modelos/cliente';




@Injectable({
  providedIn: 'root'
})
export class AccesoPedidoGuard implements CanActivate {

  
  constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc: IStorageService
  , private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return  this.storageSvc.RecuperarDatosCliente().pipe(
        first(),
        map( datos => datos != null ? true : this.router.createUrlTree(['/Cliente/Login']) )
          );
   
  }
  
}
