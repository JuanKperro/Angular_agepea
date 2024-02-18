import { Component, Inject } from '@angular/core';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';
import { ILibro } from '../../../modelos/libro';
import { Observable , concatMap, map, tap , first, mergeMap, last } from 'rxjs';
import { IProvincia } from '../../../modelos/provincia';
import { RestnodeService } from '../../../servicios/restnode.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICliente } from '../../../modelos/cliente';
import { IRestMessage } from '../../../modelos/restmessage';
import { IPedido } from '../../../modelos/pedido';
import { IDatosPago } from '../../../modelos/datospago';

@Component({
  selector: 'app-mostrarpedido',
  templateUrl: './mostrarpedido.component.html',
  styleUrl: './mostrarpedido.component.css'
})
export class MostrarpedidoComponent {

  public listaItems$!:Observable<{libroElemento:ILibro, cantidadElemento:number}[]>;
  public listaProvincias$!:Observable<IProvincia[]>;
  public subtotalPedido$! : Observable<number> ;
  public gastosEnvio: number = 0;
  public showcompdatosfacturacion: boolean = false;
  public clienteLogged$!: Observable<ICliente>;
  public clienteLogged!: ICliente

  public datosPago!: FormArray;
  public datosFacturacionForm!: FormGroup;
  public datosEnvioForm!: FormGroup;
  public datosPagoForm!: FormGroup;

  


   constructor( @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService ,
   private restSvc:RestnodeService){
      this.listaItems$=storageSvc.RecuperarElementosPedido();
      this.listaProvincias$=restSvc.RecuperarProvincias();
      this.subtotalPedido$= this.listaItems$.pipe(
        
        map( (item)=> item.reduce(
        
           (acumulador, item) =>
            acumulador + item.libroElemento.Precio * item.cantidadElemento, 0)
        )
      );

      this.storageSvc.RecuperarDatosCliente().subscribe( datos => this.clienteLogged=datos! );

   
     
        this.datosEnvioForm = new FormGroup({
          
          pais: new FormControl('España'),
          provincia: new FormControl('', [Validators.required]),
          calle: new FormControl('', [Validators.required]),
          cp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}$')] ),
          municipio: new FormControl('', [Validators.required]),
          nombre: new FormControl(this.clienteLogged.nombre, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          apellidos: new FormControl(this.clienteLogged.apellidos, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
          telefono: new FormControl(this.clienteLogged.telefono ? this.clienteLogged.telefono: '', [Validators.required , Validators.minLength(7)]),
          email: new FormControl(this.clienteLogged.cuenta.email, [Validators.required, Validators.email] ),
         otros: new FormControl('')
        });
          
        
      this.datosPagoForm = new FormGroup({
          tipoPago: new FormControl('tarjeta', [Validators.required]),
          numeroTarjeta: new FormControl('', [Validators.required]),
          caducidad_anio: new FormControl('', [Validators.required]),
          caducidad_mes: new FormControl('' , [Validators.required]),
          cvv: new FormControl('', [Validators.required]),
          nombreBanco: new FormControl('', [Validators.required])
        });

      this.datosFacturacionForm = new FormGroup({
          pais: new FormControl('España'),
          provincia: new FormControl('', [Validators.required]),
          calle: new FormControl('', [Validators.required]),
          cp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}$')] ),
          municipio: new FormControl('', [Validators.required]),

          titular: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
          nif: new FormControl('', [Validators.required])
        });

          this.datosPago = new FormArray([this.datosEnvioForm,this.datosPagoForm]);
      
   }

      ShowCompDatosFacturacion(valor:boolean){
    this.showcompdatosfacturacion=valor;
    if (valor){
      this.datosPago.push(this.datosFacturacionForm);

    } else {
      this.datosPago.controls.pop();
    }
   }

   ActualizarGastosEnvio(importe:number){
      this.gastosEnvio=importe;
   }


   ModficarItemPedido( item:[{libroElemento: ILibro, cantidadElemento:number}, operacion:string] ){
      let _libro:ILibro=item[0].libroElemento;
      let _cantidad: number=item[0].cantidadElemento;

    this.storageSvc.OperarElementosPedido(_libro,_cantidad, item[1] != 'borrar' ? 'modificar' : 'borrar')
   }

   finalizarPedido(){
    console.log(this.datosPago.value);
   
    this.storageSvc.RecuperarJWT().subscribe(
      token => {
        localStorage.setItem('tokensesion', token);
      }
    );
    const _datosPago : IDatosPago ={
      metodoPago: this.datosPagoForm.get('tipoPago')!.value,
      numeroTarjeta: this.datosPagoForm.get('numeroTarjeta')!.value,
      nombreBanco: this.datosPagoForm.get('nombreBanco')!.value,
      mesCaducidad: this.datosPagoForm.get('caducidad_mes')!.value,
      anioCaducidad: this.datosPagoForm.get('caducidad_anio')!.value,
      cvv: this.datosPagoForm.get('cvv')!.value,
      tipodireccionenvio: 'principal',
      direccionEnvio: this.datosEnvioForm.value,
      nombreEnvio: this.datosEnvioForm.get('nombre')!.value,
      apellidosEnvio: this.datosEnvioForm.get('apellidos')!.value,
      telefonoEnvio: this.datosEnvioForm.get('telefono')!.value,
      emailEnvio: this.datosEnvioForm.get('email')!.value,
      otrosDatos: this.datosEnvioForm.get('otros')!.value,
      tipoDireccionFactura: this.showcompdatosfacturacion ? 'otra' : 'igualenvio'
    };
    const pedido: IPedido = {
      idPedido: window.crypto.randomUUID(),
      fechaPedido: new Date(),
      estadoPedido: 'pendiente de pago',
      elementosPedido: [],
      subTotalPedido: 0,
      gastosEnvio: this.gastosEnvio,
      totalPedido:0,
      datosPago: _datosPago
    };

    this.listaItems$.pipe(
      mergeMap(listaItems => {
        pedido.elementosPedido = listaItems;
        
       let _subtotal=listaItems.reduce(
         (acumulador, item) =>
            acumulador + item.libroElemento.Precio * item.cantidadElemento, 0);
            console.log('subtotal:',_subtotal);
        pedido.subTotalPedido=_subtotal;
        pedido.totalPedido= pedido.subTotalPedido + pedido.gastosEnvio;
        //Guardamos datos del cliente y jwt en el localstorage       
        return this.storageSvc.RecuperarDatosCliente();
      })  
    ).subscribe(
      async clientelog => {
       /* _datosPago.emailEnvio=clientelog!.cuenta.email;
        _datosPago.nombreEnvio=clientelog!.nombre;
        _datosPago.apellidosEnvio=clientelog!.apellidos;
        _datosPago.telefonoEnvio=clientelog!.telefono;*/

        console.log('datos a mandar a server...',{ pedido: pedido, email: clientelog!.cuenta.email});
        let _resp : IRestMessage=await this.restSvc.FinalizarPedido( pedido);

        console.log('url a saltar:',_resp.mensaje);
        window.location.href=_resp.mensaje;
        }
    );

  
   }
}
