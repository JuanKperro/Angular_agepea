import { Component, Inject, OnInit} from '@angular/core';
import { Observable, of } from 'rxjs';
import { RestnodeService } from '../../../servicios/restnode.service';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';
import { IRestMessage } from '../../../modelos/restmessage';
import { IPedido } from '../../../modelos/pedido';

@Component({
  selector: 'app-pedido-finalizado',
  templateUrl: './pedido-finalizado.component.html',
  styleUrl: './pedido-finalizado.component.css'
})
export class PedidoFinalizadoComponent {

  public PedidoFinalizado$!: Observable<IPedido>;

  constructor(private restSvc: RestnodeService, @Inject (MI_TOKEN_SERVICIOSTORAGE)
  private storageSvc : IStorageService) { }


  async ngOnInit(): Promise<void> {

     let token = localStorage.getItem('tokensesion');
     if (!token) {
       //Si no hay token, enviar a login para recuperar los datos de nuevo
     }
     const resp: IRestMessage = await this.restSvc.RecuperarDatosCliente(token!);
     if (resp) {
      this.storageSvc.AlmacenarDatosCliente(resp.datoscliente!);
      this.PedidoFinalizado$ = of(resp.datoscliente!.pedidos!.shift()!);
      this.storageSvc.AlmacenarJWT(resp.token!);
     }
  }
}
