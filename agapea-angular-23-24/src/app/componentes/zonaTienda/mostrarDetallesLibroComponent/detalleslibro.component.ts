import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, RouterEvent , NavigationStart, ActivatedRoute} from '@angular/router';
import { map, filter, Observable, concatMap } from 'rxjs';
import { RestnodeService } from '../../../servicios/restnode.service';
import { ILibro } from '../../../modelos/libro';

@Component({
  selector: 'app-detalleslibro',
  templateUrl: './detalleslibro.component.html',
  styleUrl: './detalleslibro.component.css'
})
export class DetalleslibroComponent {

  public libro$!:Observable<ILibro>;

  constructor(private router : Router, private routerAct : ActivatedRoute , private restSvc : RestnodeService) { }

  ngOnInit(): void {
  
   this.libro$=this.routerAct.paramMap.pipe(
      map (params => params.get('isbn')),
      concatMap( isbn => this.restSvc.RecuperarUnLibro(isbn!))
   );


  }

}
