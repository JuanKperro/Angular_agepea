import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cambio-contrasenia',
  templateUrl: './cambio-contrasenia.component.html',
  styleUrl: './cambio-contrasenia.component.css'
})
export class CambioContraseniaComponent {
constructor(private router: Router) { }
iraTienda(){
this.router.navigate(['/']);
}

}
