import { Injectable } from '@angular/core';
import { IStorageService } from '../modelos/interfaceservicios';
import { ICliente } from '../modelos/cliente';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILibro } from '../modelos/libro';


@Injectable({
  providedIn: 'root'
})
export class SubjectstorageService implements IStorageService {

  private _clienteSubject$:BehaviorSubject<ICliente | null> = new BehaviorSubject<ICliente | null>(null);
  private _jwtSubject$:BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _elementosPedidoSubject$:BehaviorSubject<{ libroElemento: ILibro, cantidadElemento:number}[]> = new BehaviorSubject<{ libroElemento: ILibro, cantidadElemento:number}[]>([]);

private _elementosPedido: { libroElemento: ILibro, cantidadElemento:number}[] = [];

  constructor() { 
    this._elementosPedidoSubject$.asObservable().subscribe(elementos => this._elementosPedido = elementos);
  }

  RecuperarElementosPedido(): Observable<{ libroElemento: ILibro; cantidadElemento: number; }[]> {
    return this._elementosPedidoSubject$.asObservable();
  }

  OperarElementosPedido(libro:ILibro, cantidad:number, operacion:string):void {
    let _posElem : number = this._elementosPedido.findIndex(elem => elem.libroElemento.ISBN13 === libro.ISBN13);
     switch (operacion) {
      case "añadir":
        if (_posElem != -1) {
            //el libro existe ya, incremento cantidad...
            this._elementosPedido[_posElem].cantidadElemento += cantidad;
        } else {
          //libro no existe, añado nuevo elemento pedido...
          this._elementosPedido.push({libroElemento: libro, cantidadElemento: 1})
        }
        break;

      case "borrar":
        if (_posElem != -1 ) this._elementosPedido=this._elementosPedido.filter((elem)=>elem.libroElemento.ISBN13 !== libro.ISBN13);
        break;

      case "modificar":
        if (_posElem != -1 ) this._elementosPedido[_posElem].cantidadElemento=cantidad;            
        break;

      default:
        break;
    }
    
    console.log('lista elementos pedido actualizada....', this._elementosPedido);
    this._elementosPedidoSubject$.next(this._elementosPedido);
  }

      AlmacenarDatosCliente(datoscliente:ICliente):void {
      this._clienteSubject$.next(datoscliente);
      }
    AlmacenarJWT(jwt:string):void {
    this._jwtSubject$.next(jwt);
    }
    RecuperarDatosCliente():Observable<ICliente | null>{
      return this._clienteSubject$.asObservable();
    }
    RecuperarJWT():Observable<string>{
      return this._jwtSubject$.asObservable();
    }

    VaciarElementosPedido() : void {
      this._elementosPedido = [];
      this._elementosPedidoSubject$.next(this._elementosPedido);
    }

}
