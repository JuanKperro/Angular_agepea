import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent} from '../../componentes/zonaCliente/loginComponent/login.component' 
import { RegistroComponent } from '../../componentes/zonaCliente/registroComponent/registro.component' 
import { RegistrookComponent } from '../../componentes/zonaCliente/registroOkComponent/registrook.component' 
import { InicioPanelComponent } from '../../componentes/zonaCliente/inicioPanelComponent/inicio-panel.component';
import { CambioContraseniaComponent } from '../../componentes/zonaCliente/cambioContraseñaComponent/cambio-contrasenia.component';
import { CambioContraseniaOkComponent } from '../../componentes/zonaCliente/cambioContraseñaOkComponent/cambio-contrasenia-ok.component';


const routes: Routes = [
                        { 
                            path: 'Cliente',
                            children:[
                                      { path: 'Registro', component: RegistroComponent },
                                      { path: 'Login', component: LoginComponent },
                                      { path: 'RegistroOk', component: RegistrookComponent },
                                      { path: 'Panel', children:[
                                                { path: 'InicioPanel', component: InicioPanelComponent }
                                      ]},
                                      { path: 'CambioContraseña', component: CambioContraseniaComponent },
                                      { path: 'CambioContraseñaOk', component: CambioContraseniaOkComponent}
                            ]  
                        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaclienteRoutingModule { }
