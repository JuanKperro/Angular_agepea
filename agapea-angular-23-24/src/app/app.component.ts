import { Component } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent, UrlSegment } from '@angular/router';
import { Observable, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  //public showPanel:string=''; //<----- 'panelCliente' si en url: /Cliente/Panel/...., 'panelTienda' si en url: /Tienda/..., '' si en url /Cliente/Login o Registro
  public routerEvent$:Observable<RouterEvent>;
  public patron:RegExp=new RegExp("(/Cliente/(Login|Registro)|/Tienda/MostrarPedido)","g"); //<--- la opcion "g" o "global" del metodo .match, lo q hace es q si cumple el patron la cadena, no extrae los segmentos del match, solo la cadena entera encontrada


  constructor(private router:Router) {

    this.routerEvent$=router
                          .events
                          .pipe(
                                tap( ev => console.log(ev) ),
                                map( ev => ev as RouterEvent),
                                filter( (ev,i)=> ev instanceof NavigationStart)
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
