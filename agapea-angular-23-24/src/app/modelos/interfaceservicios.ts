import { Observable} from "rxjs";
import { ICliente } from "./cliente";
export interface IStorageService { 
    //#region metodos sincornos para servicios localstorageservice,.. subjectstorageservice
    AlmacenarDatosCliente(datoscliente:ICliente):void;
    AlmacenarJWT(jwt:string):void;
    RecuperarDatosCliente():Observable<ICliente>;
    RecuperarJWT():Observable<string>;

    //#endregion
    //#region metodos asincronos para servicios indexedBD
    //#endregion
}