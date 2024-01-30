import { Component } from '@angular/core';
import { ILibro } from '../../../modelos/libro';
import { RestnodeService } from '../../../servicios/restnode.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent {
  public listaLibros:ILibro[]=[]; //<---- no lo quiero, quiero usar directamente el observable ILibro[] q me da el servicio...

  constructor(private restSvc: RestnodeService,
              private activatedRoute: ActivatedRoute) {
    //recuperamos de la url el segmento donde va el idcat de los libros a recuperar....
    //  /Tienda/Libros/2-10

    // ------------- con subscripciones normales ------------------------
    // this.activatedRoute
    //     .paramMap
    //     .subscribe( //<---- nested-observables, usar mejor concatMap
    //               (param:ParamMap)=>{
    //                           let _idcat=param.get('idcat') || '2-10';
    //                           this.restSvc
    //                               .RecuperarLibros(_idcat)                                  
    //                               .subscribe(
    //                                     (datos:ILibro[])=> this.listaLibros=datos
    //                               )
    //                         }
    //   )

    //---- con operador concatMap de rxjs para evitar nested-subscribes....
      this.activatedRoute
          .paramMap
          .pipe( concatMap( (param:ParamMap)=>  { return this.restSvc.RecuperarLibros(param.get('idcat') || '2-10') } ) )
          .subscribe(  (datos:ILibro[])=> this.listaLibros=datos );

  }
}
