import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { fromEvent, map, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Directive({
  selector: '[appBuscarLibros]'
})
export class BuscarLibrosDirective {
  @Output() appBusqueda = new EventEmitter<string>();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    fromEvent(this.el.nativeElement, 'input').pipe(

      map((e: any) => e.target.value ),
      
      debounceTime(400),
      distinctUntilChanged(),
      tap(e =>
      console.log('en directiva, valor de e:' + e)),
    ).subscribe(
      (text: unknown) => 
      this.appBusqueda.emit(text as string));
  }
}
