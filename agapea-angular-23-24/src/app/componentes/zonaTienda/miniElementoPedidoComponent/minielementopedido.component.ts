import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILibro } from '../../../modelos/libro';

@Component({
  selector: 'app-minielementopedido',
  templateUrl: './minielementopedido.component.html',
  styleUrl: './minielementopedido.component.css'
})
export class MinielementopedidoComponent {
  @Input() public elmento!:{libroElemento:ILibro, cantidadElemento:number};
  @Output() public operarItemEvent:EventEmitter<[{libroElemento:ILibro, cantidadElemento:number},string]>=new EventEmitter<[{libroElemento:ILibro, cantidadElemento:number},string]>();

  operarItemPedido(operacion:string){
    console.log(operacion)
    switch(operacion){
      case 'sumar':
        
        this.elmento.cantidadElemento++;
        break;
      case 'restar':
        this.elmento.cantidadElemento--;
        break;
      case 'borrar':
        this.elmento.cantidadElemento=0;
        break;
    }
    this.operarItemEvent.emit([this.elmento,operacion]);

  }
}
