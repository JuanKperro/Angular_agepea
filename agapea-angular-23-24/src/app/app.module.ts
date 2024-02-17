import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//----------------- modulos secundarios hijos del modulo principal de la aplicacion ----------------
 // AppRoutingModule: modulo encargardo de detectar variacion de url en navegador y en funcion de su fich.configuracion:  app-routing.module.ts
 // carga un componente u otro
import { AppRoutingModule } from './app-routing.module';

//HttpClientModule: modulo encargado de dar inyeccion de servicios comumes para hacer pet.HTTP externas
//usando servicio HttpClient....tb permite definicion INTERCEPTORS
import { HTTP_INTERCEPTORS, HttpClientModule , provideHttpClient, withInterceptors } from '@angular/common/http';

//ReactiveFormsModule: modulo donde se definen directivas a usar en vistas de componentes para mapear objetos FormGroup y FormControl
//contra elemenos del dom (directivas formGroup y formControlName)
//para formularios basados en templates: FormsModule <--- acceso a ngModel, ngForm
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { ZonaclienteModule} from './modulos_zonas/moduloZonaCliente/zonacliente.module';
import { ZonatiendaModule} from './modulos_zonas/moduloZonaTienda/zonatienda.module';
//-------------------- componentes del modulo principal de la aplicacion----------------------------
import { AppComponent } from './app.component';

import { PanelclienteComponent } from './componentes/zonaCliente/panelClienteComponent/panelcliente.component';
import { PanelTiendaComponent } from './componentes/zonaTienda/panelTiendaComponent/panel-tienda.component';
//-------------------- directivas del modulo princiapal de la aplicacion ---------------------------

//-------------------- pipes del modulo princiapal de la aplicacion --------------------------------

//-------------------- servicios del modulo princiapal de la aplicacion -----------------------------
import { RestnodeService } from './servicios/restnode.service';
import { MI_TOKEN_SERVICIOSTORAGE } from './servicios/injectiontokenstorageservices';
import { SubjectstorageService } from './servicios/subjectstorage.service';
//---------------------- interceptor del modulo principal de la aplicacion ---------------------------
import { AuthjwtInterceptor } from './servicios_INTERCEPTORS/authjwt.interceptor';
// interceptor en version 17 angular
import { authjwtv17Interceptor } from './servicios_INTERCEPTORS/authjwtv17.interceptor';





@NgModule({
  declarations: [ //<------ array con defs. de componentes, directivas y pipes disponibles para toda la aplicacion
    AppComponent,
    PanelTiendaComponent,
    PanelclienteComponent
  ],
  imports: [ //<------------ array con modulos secundiarios q tu aplicacion va a usar
    BrowserModule,
    //HttpClientModule,
    ReactiveFormsModule,
    FormsModule,    
    ZonaclienteModule,
    ZonatiendaModule,
    AppRoutingModule
  ],
  providers: [
    RestnodeService, //{ provide: RestnodeService, useClass: RestnodeService}
    { provide: MI_TOKEN_SERVICIOSTORAGE, useClass: SubjectstorageService }
    //,{ provide: HTTP_INTERCEPTORS, useClass: AuthjwtInterceptor, multi: true }
    // interceptor en version 17 angular (importar provideHttpClient, withInterceptors de '@angular/common/http')
    ,provideHttpClient(
      withInterceptors([authjwtv17Interceptor])
    ),
  ], //<-------- array para definir inyeccion de dependencias de servicios usados por componentes
  bootstrap: [AppComponent]
})
export class AppModule { }
