import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ZonatiendaRoutingModule } from './zonatienda-routing.module';

// -------------------- componentes de la zona Tienda:
import { MostrarpedidoComponent } from '../../componentes/zonaTienda/pedidoComponent/mostrarpedido.component';
import { MinielementopedidoComponent } from '../../componentes/zonaTienda/miniElementoPedidoComponent/minielementopedido.component';
import { LibrosComponent } from '../../componentes/zonaTienda/librosComponent/libros.component';
import { DetalleslibroComponent } from '../../componentes/zonaTienda/mostrarDetallesLibroComponent/detalleslibro.component';
import { MinilibroComponent } from '../../componentes/zonaTienda/minilibroComponent/minilibro.component';
import { DatosenvioComponent } from '../../componentes/zonaTienda/datosEnvioComponent/datosenvio.component';
import { DatosfacturacionComponent } from '../../componentes/zonaTienda/datosFacturacionComponent/datosfacturacion.component';
import { DatospagoComponent } from '../../componentes/zonaTienda/datosPagoComponent/datospago.component';

//-------------------- pipes del modulo de zona Tienda --------------------------------
import { RedondeocantidadPipe } from '../../pipes/redondeocantidad.pipe';
import { PedidoFinalizadoComponent } from '../../componentes/zonaTienda/pedidoFinalizadoComponent/pedido-finalizado.component';


@NgModule({
  declarations: [
    MinilibroComponent,
    MostrarpedidoComponent,
    MinielementopedidoComponent,
    DatosenvioComponent,
    DatosfacturacionComponent,
    DatospagoComponent,
    LibrosComponent,
    DetalleslibroComponent,
    RedondeocantidadPipe,
    PedidoFinalizadoComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ZonatiendaRoutingModule
  ]
})
export class ZonatiendaModule { }
