import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IRestMessage } from '../../../modelos/restmessage';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';
import { ICliente } from '../../../modelos/cliente';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public credenciales:{ email:string, password:string}={ email:'', password:''};
  public erroresLoginServer:string="";
  //email: o1ax55709y@bloheyz.com
  //passowrd: Hola1234!

  constructor( private router:Router,
               private restService: RestnodeService,
               @Inject (MI_TOKEN_SERVICIOSTORAGE) private storageSvc: IStorageService ) {   }

  irARegistro(){
    this.router.navigateByUrl('/Cliente/Registro');
  }

 async LoginCliente(loginform:NgForm){
    console.log('el ngForm vale...', loginform.form);

    let _respuesta:IRestMessage=await this.restService.LoginCliente(loginform.form.value);
    console.log('el objeto respuesta es...', _respuesta);
    if(_respuesta.codigo===0){
      //guardar datos cliente en el almacenamiento local...
      this.storageSvc.AlmacenarDatosCliente(_respuesta.datoscliente as ICliente);
      this.storageSvc.AlmacenarJWT(_respuesta.token as string);
        this.router.navigateByUrl('/Tienda/Libros/2-10');
        
    } else {
      //mostrar mensajes de error en vista del componente...
      this.erroresLoginServer=_respuesta.mensaje;
      console.log('el error es...', _respuesta.mensaje);  
    }

  }
}
