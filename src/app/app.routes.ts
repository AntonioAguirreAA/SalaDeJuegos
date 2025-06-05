import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { JuegosComponent } from './componentes/juegos/juegos.component';
import { QuiensoyComponent } from './componentes/quiensoy/quiensoy.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { AhorcadoComponent } from './componentes/juegos/ahorcado/ahorcado.component';
import { PreguntadosComponent } from './componentes/juegos/preguntados/preguntados.component';
import { MayormenorComponent } from './componentes/juegos/mayormenor/mayormenor.component';
import { ColorcontrasteComponent } from './componentes/juegos/colorcontraste/colorcontraste.component';
import { ResultadosComponent } from './componentes/resultados/resultados.component';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'juegos',
    loadChildren: () =>
      import('./componentes/juegos/juegos.module').then((m) => m.JuegosModule),
  },

  {
    path: 'quiensoy',
    component: QuiensoyComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
  {
    path: 'resultados',
    component: ResultadosComponent,
  },
  {
    path: 'encuesta',
    component: EncuestaComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];
