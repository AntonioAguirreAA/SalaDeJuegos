import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegosComponent } from './juegos.component';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayormenorComponent } from './mayormenor/mayormenor.component';
import { ColorcontrasteComponent } from './colorcontraste/colorcontraste.component';
import { PreguntadosComponent } from './preguntados/preguntados.component';

const routes: Routes = [
  {
    path: '',
    component: JuegosComponent,
    children: [
      { path: 'ahorcado', component: AhorcadoComponent },
      { path: 'mayormenor', component: MayormenorComponent },
      { path: 'colorcontraste', component: ColorcontrasteComponent },
      { path: 'preguntados', component: PreguntadosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosRoutingModule {}
