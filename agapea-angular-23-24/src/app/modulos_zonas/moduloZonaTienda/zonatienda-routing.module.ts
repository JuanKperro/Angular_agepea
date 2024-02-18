import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MostrarpedidoComponent } from '../../componentes/zonaTienda/pedidoComponent/mostrarpedido.component';
import { LibrosComponent } from '../../componentes/zonaTienda/librosComponent/libros.component';
import { DetalleslibroComponent } from '../../componentes/zonaTienda/mostrarDetallesLibroComponent/detalleslibro.component';
import { AccesoPedidoGuard } from '../../servicios_guards/acceso-pedido.guard';
import {guardv17Guard} from '../../servicios_guards/guardv17.guard';
import { PedidoFinalizadoComponent } from '../../componentes/zonaTienda/pedidoFinalizadoComponent/pedido-finalizado.component';

const routes: Routes = [
  {
    path: 'Tienda',
    children:[
      { path: 'Libros/:idcat', component: LibrosComponent },
      { path: 'MostrarLibro/:isbn', component: DetalleslibroComponent },
      { path: 'MostrarPedido', component: MostrarpedidoComponent, canActivate: [guardv17Guard]},
      { path: 'PedidoFinalizado', component: PedidoFinalizadoComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonatiendaRoutingModule { }
