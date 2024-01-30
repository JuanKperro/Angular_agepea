import { ICliente } from "./cliente";
export interface IStorageService { 
    AlmacenarDatosCliente(datoscliente:ICliente):void;
    AlmacenarJWT(jwt:string):void;
    RecuperarDatosCliente():ICliente;
    RecuperarJWT():string;
}