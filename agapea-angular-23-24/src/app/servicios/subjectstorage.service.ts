import { Injectable } from '@angular/core';
import { IStorageService } from '../modelos/interfaceservicios';
import { ICliente } from '../modelos/cliente';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILibro } from '../modelos/libro';


@Injectable({
  providedIn: 'root'
})
export class SubjectstorageService implements IStorageService {

  private _clienteSubject$:BehaviorSubject<ICliente> = new BehaviorSubject<ICliente>({nombre:'',apellidos:'', telefono:'', cuenta: { email:'', cuentaActvia:false }});
  private _jwtSubject$:BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _elementosPedidoSubject$:BehaviorSubject<ILibro[]> = new BehaviorSubject<ILibro[]>([]);

  constructor() { }

      AlmacenarDatosCliente(datoscliente:ICliente):void {
    this._clienteSubject$.next(datoscliente);
      }
    AlmacenarJWT(jwt:string):void {
    this._jwtSubject$.next(jwt);
    }
    RecuperarDatosCliente():Observable<ICliente>{
      return this._clienteSubject$.asObservable();
    }
    RecuperarJWT():Observable<string>{
      return this._jwtSubject$.asObservable();
    }

}
