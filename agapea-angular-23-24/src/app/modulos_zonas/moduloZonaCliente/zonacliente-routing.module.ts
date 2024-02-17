import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent} from '../../componentes/zonaCliente/loginComponent/login.component' 
import { RegistroComponent } from '../../componentes/zonaCliente/registroComponent/registro.component' 
import { RegistrookComponent } from '../../componentes/zonaCliente/registroOkComponent/registrook.component' 
import { InicioPanelComponent } from '../../componentes/zonaCliente/inicioPanelComponent/inicio-panel.component';


const routes: Routes = [
                        { 
                            path: 'Cliente',
                            children:[
                                      { path: 'Registro', component: RegistroComponent },
                                      { path: 'Login', component: LoginComponent },
                                      { path: 'RegistroOk', component: RegistrookComponent },
                                      { path: 'Panel', children:[
                                                { path: 'InicioPanel', component: InicioPanelComponent }
                                      ]}
                            ]  
                        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaclienteRoutingModule { }
