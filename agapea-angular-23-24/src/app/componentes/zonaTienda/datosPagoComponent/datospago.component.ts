import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datospago',
  templateUrl: './datospago.component.html',
  styleUrl: './datospago.component.css'
})
export class DatospagoComponent {
 @Input() tituloPago:string="2. - Datos Pago.";
  @Input() datosPago!:FormGroup;
  mostrarDatosPago:boolean=true;
 
  meses:number[]=Array.from({length:12}, (el,pos)=> pos+1);
  //meses:string[]=[ 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre' ];
  anios:number[]=Array.from( { length: 9 }, (el,pos)=> pos + new Date(Date.now()).getFullYear() );

  constructor() { }

  showDatosCard(ev:any){
    console.log(ev.target.value);
    if (ev.target.value === 'pagotarjeta'){
    this.mostrarDatosPago=true;
  } else {
    this.mostrarDatosPago=false;

    }
    this.datosPago.controls['tipoPago'].setValue(ev.target.value);    
  }


}
