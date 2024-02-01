import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { IRestMessage } from '../modelos/restmessage';
import { ILibro } from '../modelos/libro';
import { ICategoria } from '../modelos/categoria';
import { IMunicipio } from '../modelos/municipio';
import { IProvincia } from '../modelos/provincia';

@Injectable({
  providedIn: 'root'
})
export class RestnodeService {
  //servicio para poder hacer pet.rest a serv.RESFTULL de nodejs....
  constructor(private _httpclient:HttpClient) { }


  //#region ------ metodos para zona Cliente ----------
  public LoginCliente(credenciales:{email:string, password:string}):Promise<IRestMessage>{
    //¿¿como cojones hago para mandar objeto "credenciales" q me pasa el componente login.component.ts
    //a nodejs usando el servicio HttpClient de angular??
        return lastValueFrom(
                    this._httpclient.post<IRestMessage>(
                              'http://localhost:3000/api/Cliente/Login',
                              credenciales,
                              { 
                                headers: new HttpHeaders({'Content-Type': 'application/json'})
                              }
                              )
        );

  }

  public ComprobarEmail(email:string):Observable<IRestMessage>{
    return this._httpclient.get(`http://localhost:3000/api/Cliente/ComprobarEmail?email=${email}`) as Observable<IRestMessage>;
  }

  public ActivarCuenta(mode:string|null, oobCode:string|null, apiKey:string|null):Observable<IRestMessage>{
      return this._httpclient.get(`http://localhost:3000/api/Cliente/ActivarCuenta?mod=${mode}&cod=${oobCode}&key=${apiKey}`) as Observable<IRestMessage>;
  }
  //#endregion

  //#region ------ metodos para zona Tienda -----------
    public RecuperarCategorias(idcat:string): Observable<ICategoria[]>{
      if(!! idcat ) idcat='raices';
      return this._httpclient.get<ICategoria[]>(`http://localhost:3000/api/Tienda/RecuperarCategorias?idcat=${idcat}`);

    }

    public  RecuperarLibros(idcat:string): Observable<ILibro[]>{
        if(!! idcat ) idcat='2-10';
        return this._httpclient.get<ILibro[]>(`http://localhost:3000/api/Tienda/RecuperarLibros?idcat=${idcat}`);
    }


    public RecuperarUnLibro(isbn:string):Observable<ILibro> {
        return this._httpclient.get<ILibro>(`http://localhost:3000/api/Tienda/RecuperarUnLibro?isbn=${isbn}`);
    }

        public RecuperarProvincias():Observable<IProvincia[]>{
        return this._httpclient.get<IProvincia[]>('http://localhost:3000/api/Tienda/RecuperarProvincias');
    }

    public RecuperarMunicipios(codpro:string):Observable<IMunicipio[]>{
      return this._httpclient.get<IMunicipio[]>(`http://localhost:3000/api/Tienda/RecuperarMunicipios?codpro=${codpro}`);
  }
  //#endregion

}
