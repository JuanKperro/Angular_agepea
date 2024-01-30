import { Component, Input, Inject } from '@angular/core';
import { ILibro } from '../../../modelos/libro';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';

@Component({
  selector: 'app-minilibro',
  templateUrl: './minilibro.component.html',
  styleUrl: './minilibro.component.css'
})
export class MinilibroComponent {
  @Input() libroAPintar!:ILibro;

  constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService ) {

   }

  AddLibroPedido(){
    
  }
}
