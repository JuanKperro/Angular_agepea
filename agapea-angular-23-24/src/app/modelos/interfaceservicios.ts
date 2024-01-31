import { Observable} from "rxjs";
import { ICliente } from "./cliente";
import { ILibro } from "./libro";
export interface IStorageService { 
    //#region metodos sincornos para servicios localstorageservice,.. subjectstorageservice
    AlmacenarDatosCliente(datoscliente:ICliente):void;
    AlmacenarJWT(jwt:string):void;
    RecuperarDatosCliente():Observable<ICliente>;
    RecuperarJWT():Observable<string>;


    OperarElementosPedido(libro:ILibro, cantidad:number, operacion:string):void
    RecuperarElementosPedido():Observable<{libroElemento:ILibro, cantidadElemento:number}[]>
    //#endregion
    //#region metodos asincronos para servicios indexedBD
    //#endregion
}