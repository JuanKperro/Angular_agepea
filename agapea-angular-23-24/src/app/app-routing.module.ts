import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/zonaCliente/registroComponent/registro.component';
import { LoginComponent } from './componentes/zonaCliente/loginComponent/login.component';
import { RegistrookComponent } from './componentes/zonaCliente/registroOkComponent/registrook.component';
import { LibrosComponent } from './componentes/zonaTienda/librosComponent/libros.component';
import { DetalleslibroComponent } from './componentes/zonaTienda/mostrarDetallesLibroComponent/detalleslibro.component';
import { MostrarpedidoComponent } from './componentes/zonaTienda/pedidoComponent/mostrarpedido.component';
import { AccesoPedidoGuard } from './servicios_guards/acceso-pedido.guard';
import { AuthjwtInterceptor } from './servicios_INTERCEPTORS/authjwt.interceptor';
import { PanelclienteComponent } from './componentes/zonaCliente/panelClienteComponent/panelcliente.component';

//modulo principal de enrutamiento usado por el modulo global de la aplicacion app.module.ts
//necesitan tener definidos un array de objetos de tipo interface Route
const routes: Routes = [
  { path: 'Cliente',
    children:[
              { path: 'Registro', component: RegistroComponent },
              { path: 'Login', component: LoginComponent },
              { path: 'RegistroOk', component: RegistrookComponent },
              { path : 'PanelCliente', component: PanelclienteComponent}
    ]  
  } ,
  {
    path: 'Tienda',
    children:[
      { path: 'Libros/:idcat?', component: LibrosComponent },
      { path: 'MostrarLibro/:isbn', component: DetalleslibroComponent },
      { path: 'MostrarPedido', component: MostrarpedidoComponent, canActivate:[ AccesoPedidoGuard ]}
    ]
  },
  { path: '', redirectTo: '/Tienda/Libros/2-10', pathMatch:'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
