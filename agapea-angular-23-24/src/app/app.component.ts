import { Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent, UrlSegment } from '@angular/router';
import { Observable, filter, map, tap } from 'rxjs';
import { MI_TOKEN_SERVICIOSTORAGE } from './servicios/injectiontokenstorageservices';
import { IStorageService } from './modelos/interfaceservicios';
import { ICliente } from './modelos/cliente';
import { ILibro } from './modelos/libro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  //public showPanel:string=''; //<----- 'panelCliente' si en url: /Cliente/Panel/...., 'panelTienda' si en url: /Tienda/..., '' si en url /Cliente/Login o Registro
  public routerEvent$:Observable<RouterEvent>;
  
  public listaItemsPedido$!:Observable<{libroElemento:ILibro, cantidadElemento:number}[]>;
  public SubtotalPedido$!:Observable<number>;
  public _clienteLoggedSubject!: Observable<ICliente | null> ;
  public patron:RegExp=new RegExp("(/Cliente/(Login|Registro)|/Tienda/MostrarPedido)","g"); //<--- la opcion "g" o "global" del metodo .match, lo q hace es q si cumple el patron la cadena, no extrae los segmentos del match, solo la cadena entera encontrada


  constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc: IStorageService  , private router:Router) {

    this._clienteLoggedSubject=storageSvc.RecuperarDatosCliente();
    this.routerEvent$=router
                          .events
                          .pipe(
                                tap( ev => console.log(ev) ),
                                map( ev => ev as RouterEvent),
                                filter( (ev,i)=> ev instanceof NavigationStart)
                          );
    this.listaItemsPedido$=storageSvc.RecuperarElementosPedido();
    this.SubtotalPedido$=this.listaItemsPedido$.pipe(
      map( (item)=> item.reduce(
        (acumulador, item) =>
          acumulador + item.libroElemento.Precio * item.cantidadElemento, 0)
      )
    ); 
    


    /*
    // router.events.subscribe(
    //   (ev)=>{
    //     if(ev instanceof NavigationStart){
    //       if ( new RegExp("(/Cliente/(Login|Registro)|/Tienda/MostrarPedido)").test(ev.url)  ){
    //         this.showPanel='';
    //       } else {
    //           this.showPanel=new RegExp("/Cliente/Panel/*").test(ev.url) ? 'panelCliente' : 'panelTienda'; 
    //       }          
    //     }
    //   }
    // )
    */
   }

}
