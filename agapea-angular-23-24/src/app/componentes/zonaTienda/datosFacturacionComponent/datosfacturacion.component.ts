import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { IProvincia } from '../../../modelos/provincia';
import { Observable } from 'rxjs';
import { IMunicipio } from '../../../modelos/municipio';
import { RestnodeService } from '../../../servicios/restnode.service';

@Component({
  selector: 'app-datosfacturacion',
  templateUrl: './datosfacturacion.component.html',
  styleUrl: './datosfacturacion.component.css'
})
export class DatosfacturacionComponent {
  @Input()listaProvincias!:IProvincia[];
  @ViewChild('selectmunis') selectmunis!:ElementRef;
  
  public checkempresa:boolean=true;
  public checkmismadirecfactura:boolean=true;
  public listaMunicipios$!:Observable<IMunicipio[]>;

  constructor(private restSvc:RestnodeService, private render2:Renderer2){ }

  CheckEmpresaChange(valor:boolean){
    this.checkempresa=valor;
  }

  CargarMunicipios( provSelec:string){ //<--- va: "cpro - nombre provincia"
      this.listaMunicipios$=this.restSvc.RecuperarMunicipios(provSelec.split('-')[0]);
      this.render2.removeAttribute(this.selectmunis.nativeElement, 'disabled');
  }
}
