import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { ZonaclienteRoutingModule } from './zonacliente-routing.module'

//-------------- componentes a importar por este modulo de zona Cliente -------------
import { LoginComponent} from '../../componentes/zonaCliente/loginComponent/login.component' 
import { RegistroComponent } from '../../componentes/zonaCliente/registroComponent/registro.component' 
import { RegistrookComponent } from '../../componentes/zonaCliente/registroOkComponent/registrook.component' 
import { InicioPanelComponent } from '../../componentes/zonaCliente/inicioPanelComponent/inicio-panel.component';
import { ModaldireccionesComponent } from '../../componentes/zonaCliente/modalDireccionesComponent/modaldirecciones.component';
import { MinidireccionComponent } from '../../componentes/zonaCliente/miniDireccionComponent/minidireccion.component';

//-------------------- directivas del modulo princiapal de la aplicacion ---------------------------
import { EmailfilterdomainDirective } from '../../directivas/emailfilterdomain.directive'
import { ComprobacionexisteemailDirective } from '../../directivas/comprobacionexisteemail.directive';

@NgModule({
  declarations: [
    EmailfilterdomainDirective,
    ComprobacionexisteemailDirective,
    LoginComponent,
    RegistroComponent,
    RegistrookComponent,
    InicioPanelComponent,
    ModaldireccionesComponent,
    MinidireccionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ZonaclienteRoutingModule
  ]
})
export class ZonaclienteModule { }
