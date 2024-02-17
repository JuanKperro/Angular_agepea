import { Component, OnInit, Inject } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { RestnodeService } from '../../../servicios/restnode.service';

@Component({
  selector: 'app-cambio-contrasenia-ok',
  templateUrl: './cambio-contrasenia-ok.component.html',
  styleUrl: './cambio-contrasenia-ok.component.css'
})
export class CambioContraseniaOkComponent {
public titulo: string = "Espere...";
public mensaje: string = "Se esta aplicando el cambio de contraseña, espere por favor...";
private email: string | null = '';
private token: string | null = '';
private pass: string | null = '';
constructor(private router:Router 
  ,private route: ActivatedRoute, private restSvc : RestnodeService) { 
  route.paramMap.subscribe(
    (params: ParamMap) => {
      this.email = params.get('email');
      this.token = params.get('token');
      this.pass = params.get('pass'); 
      }) ;
}

async ngOnInit() {
  if (this.email == null || this.token == null || this.pass == null) {
    this.titulo = "Error";
    this.mensaje = "No se ha podido cambiar la contraseña, por favor, vuelva a intentarlo"; 
  }
 const resp= await this.restSvc.ConfirmarCambioContraseña(this.email!, this.token!, this.pass!);



}

iraLogin(){
  this.router.navigate(['/Cliente/Login']);
}


}
