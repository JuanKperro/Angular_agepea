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
import { CambioContraseniaComponent } from '../../componentes/zonaCliente/cambioContraseñaComponent/cambio-contrasenia.component';
import { CambioContraseniaOkComponent } from '../../componentes/zonaCliente/cambioContraseñaOkComponent/cambio-contrasenia-ok.component';

//-------------------- directivas del modulo princiapal de la aplicacion ---------------------------
import { EmailfilterdomainDirective } from '../../directivas/emailfilterdomain.directive'
import { ComprobacionexisteemailDirective } from '../../directivas/comprobacionexisteemail.directive';
import { MisComprasComponent } from '../../componentes/zonaCliente/misComprasComponent/mis-compras.component';

@NgModule({
  declarations: [
    EmailfilterdomainDirective,
    ComprobacionexisteemailDirective,
    LoginComponent,
    RegistroComponent,
    RegistrookComponent,
    InicioPanelComponent,
    ModaldireccionesComponent,
    MinidireccionComponent,
    CambioContraseniaComponent,
    CambioContraseniaOkComponent,
    MisComprasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ZonaclienteRoutingModule
  ]
})
export class ZonaclienteModule { }
