import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { compareToValidator } from '../../../validators/compareTo';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IRestMessage } from '../../../modelos/restmessage';
import { ICliente } from '../../../modelos/cliente';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  public miform:FormGroup;
  private _cliente : ICliente = {} as ICliente;
  private suscripcion! : Subscription ;

  constructor(private restSvc: RestnodeService, private router:Router) {
    this.miform=new FormGroup(
      {
        nombre: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ]  ),
        apellidos: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(200) ]),
        email: new FormControl('', [ Validators.required, Validators.email ] ), //<---- validador asincrono para comprobar q no exista ya el email
        repemail: new FormControl('', [ Validators.required, Validators.email, compareToValidator('email') ]),
        password: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')] ),
        repassword: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$'), compareToValidator('password') ]),
        login: new FormControl('',[ Validators.required,Validators.minLength(3),Validators.maxLength(25) ]),
        telefono: new FormControl()
      }
    );
    
  }

  registrarCliente(){
     console.log(this.miform.value);
     this._cliente = {
        nombre: this.miform.value.nombre,
        apellidos: this.miform.value.apellidos,
        cuenta: {
        email: this.miform.value.email,
        login: this.miform.value.login,
        cuentaActiva: false,
        imagenAvatarBASE64: ''
        },
        telefono: this.miform.value.telefono,
        
     }
     
     this.suscripcion= this.restSvc.RegistrarCliente([this._cliente,this.miform.value.password]).subscribe(
        (resp:IRestMessage)=>{
          if (resp.codigo===0){
            this.router.navigate(['/Cliente/RegistroOk']);
          }
        },
        (error)=>{
          console.log(error);
        }
     );
     //recibir datos como observable...almacenar subscripcion en una variable
     //cuando te subscribas, recibes objeto IRestMessage (controlar codigo respuesta)
     //en el dispose del compnente usando esa variable, cierre subscripcion...
  }
  OnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

}
