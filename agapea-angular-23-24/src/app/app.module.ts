import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//----------------- modulos secundarios hijos del modulo principal de la aplicacion ----------------
 // AppRoutingModule: modulo encargardo de detectar variacion de url en navegador y en funcion de su fich.configuracion:  app-routing.module.ts
 // carga un componente u otro
import { AppRoutingModule } from './app-routing.module';

//HttpClientModule: modulo encargado de dar inyeccion de servicios comumes para hacer pet.HTTP externas
//usando servicio HttpClient....tb permite definicion INTERCEPTORS
import { HttpClientModule } from '@angular/common/http';

//ReactiveFormsModule: modulo donde se definen directivas a usar en vistas de componentes para mapear objetos FormGroup y FormControl
//contra elemenos del dom (directivas formGroup y formControlName)
//para formularios basados en templates: FormsModule <--- acceso a ngModel, ngForm
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

//-------------------- componentes del modulo principal de la aplicacion----------------------------
import { AppComponent } from './app.component';
import { RegistroComponent } from './componentes/zonaCliente/registroComponent/registro.component';
import { LoginComponent } from './componentes/zonaCliente/loginComponent/login.component';

//-------------------- directivas del modulo princiapal de la aplicacion ---------------------------
import { EmailfilterdomainDirective } from './directivas/emailfilterdomain.directive'

//-------------------- pipes del modulo princiapal de la aplicacion --------------------------------
import { RedondeocantidadPipe } from './pipes/redondeocantidad.pipe';


//-------------------- servicios del modulo princiapal de la aplicacion -----------------------------
import { RestnodeService } from './servicios/restnode.service';
import { ComprobacionexisteemailDirective } from './directivas/comprobacionexisteemail.directive';
import { RegistrookComponent } from './componentes/zonaCliente/registroOkComponent/registrook.component';
import { PanelclienteComponent } from './componentes/zonaCliente/panelClienteComponent/panelcliente.component';
import { PanelTiendaComponent } from './componentes/zonaTienda/panelTiendaComponent/panel-tienda.component';
import { LibrosComponent } from './componentes/zonaTienda/librosComponent/libros.component';
import { DetalleslibroComponent } from './componentes/zonaTienda/mostrarDetallesLibroComponent/detalleslibro.component';
import { MinilibroComponent } from './componentes/zonaTienda/minilibroComponent/minilibro.component';
import { MI_TOKEN_SERVICIOSTORAGE } from './servicios/injectiontokenstorageservices';
import { SubjectstorageService } from './servicios/subjectstorage.service';
import { LocalstorageService } from './servicios/localstorage.service';
import { MostrarpedidoComponent } from './componentes/zonaTienda/pedidoComponent/mostrarpedido.component';
import { MinielementopedidoComponent } from './componentes/zonaTienda/miniElementoPedidoComponent/minielementopedido.component';


@NgModule({
  declarations: [ //<------ array con defs. de componentes, directivas y pipes disponibles para toda la aplicacion
    AppComponent,
    RegistroComponent,
    LoginComponent,
    EmailfilterdomainDirective,
    ComprobacionexisteemailDirective,
    RegistrookComponent,
    PanelclienteComponent,
    PanelTiendaComponent,
    LibrosComponent,
    DetalleslibroComponent,
    RedondeocantidadPipe,
    MinilibroComponent,
    MostrarpedidoComponent,
    MinielementopedidoComponent
  ],
  imports: [ //<------------ array con modulos secundiarios q tu aplicacion va a usar
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    RestnodeService, //{ provide: RestnodeService, useClass: RestnodeService}
    { provide: MI_TOKEN_SERVICIOSTORAGE, useClass: SubjectstorageService },

  ], //<-------- array para definir inyeccion de dependencias de servicios usados por componentes
  bootstrap: [AppComponent]
})
export class AppModule { }
