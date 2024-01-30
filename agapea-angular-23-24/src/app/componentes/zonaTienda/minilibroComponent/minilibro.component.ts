import { Component, Input } from '@angular/core';
import { ILibro } from '../../../modelos/libro';

@Component({
  selector: 'app-minilibro',
  templateUrl: './minilibro.component.html',
  styleUrl: './minilibro.component.css'
})
export class MinilibroComponent {
  @Input() libroAPintar!:ILibro;


  AddLibroPedido(){
    
  }
}
