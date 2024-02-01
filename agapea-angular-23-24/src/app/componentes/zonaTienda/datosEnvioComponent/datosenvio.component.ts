import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, Renderer2, ViewChild, ViewRef } from '@angular/core';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';
import { Observable, Subscription } from 'rxjs';
import { ICliente } from '../../../modelos/cliente';
import { IDireccion } from '../../../modelos/direccion';
import { IProvincia } from '../../../modelos/provincia';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IMunicipio } from '../../../modelos/municipio';

@Component({
  selector: 'app-datosenvio',
  templateUrl: './datosenvio.component.html',
  styleUrl: './datosenvio.component.css'
})
export class DatosenvioComponent implements OnDestroy {
    
    @Input()listaProvincias!:IProvincia[];
    @Output() checkdatosFacturacionEvent:EventEmitter<boolean>=new EventEmitter<boolean>();
    @ViewChild('selectmunis') selectmunis!:ElementRef;

    //public datosCliente$!:Observable<ICliente>;
    public datosCliente!:ICliente | null;
    public direccionprincipal:IDireccion | undefined;
    private datosClienteSubscriptor:Subscription;
    public listaMunicipios$!:Observable<IMunicipio[]>;
    

    //----variables de tipo switch para ocultar/mostrar partes de la vista datosenvio-----
    public checkdirppalenvio:boolean=true;
    public checkclienteloggedenvio:boolean=true;
    

    constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService,
                private restSvc: RestnodeService,
                private render2: Renderer2){
      //this.datosCliente$=this.storageSvc.RecuperarDatosCliente();
      this.datosClienteSubscriptor=this.storageSvc
                                      .RecuperarDatosCliente()
                                      .subscribe( datos => { 
                                            this.datosCliente=datos;
                                            this.direccionprincipal=this.datosCliente?.direcciones?.filter((d:IDireccion)=>d.esPrincipal==true)[0]
                                          });
    }
    CargarMunicipios( provSelec:string){ //<--- va: "cpro - nombre provincia"
      this.listaMunicipios$=this.restSvc.RecuperarMunicipios(provSelec.split('-')[0]);
      this.render2.removeAttribute(this.selectmunis.nativeElement, 'disabled');
    }

    ShowComponenteDatosFactura(ev:any){
      this.checkdatosFacturacionEvent.emit(ev.target.checked);
    }
    CheckdirPpalEnvio(check:boolean){
      this.checkdirppalenvio=check;
    }

    CheckClienteLoggedEnvio(check:boolean){
      this.checkclienteloggedenvio=check;
    }

    ngOnDestroy(): void {
      this.datosClienteSubscriptor.unsubscribe();
    }
  
}
