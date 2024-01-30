import { Injectable } from '@angular/core';
import { IStorageService } from '../modelos/interfaceservicios';
import { ICliente } from '../modelos/cliente';
import {Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements IStorageService {

  constructor() { }
  AlmacenarDatosCliente(datoscliente: ICliente): void {
    localStorage.setItem('datoscliente', JSON.stringify(datoscliente));
    
  }
  AlmacenarJWT(jwt: string): void {
    localStorage.setItem('jwt', jwt);
    
  }
  RecuperarDatosCliente(): Observable<ICliente> {
    let _datoscliente:ICliente = JSON.parse(localStorage.getItem('datoscliente')) as ICliente;
    return of(_datoscliente);
  }
  RecuperarJWT(): Observable<string> {
    throw new Error("Method not implemented.");
  }

}
