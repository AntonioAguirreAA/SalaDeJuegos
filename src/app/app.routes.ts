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
    component: JuegosComponent,
    children: [
      {
        path: 'ahorcado',
        component: AhorcadoComponent,
      },
      {
        path: 'preguntados',
        component: PreguntadosComponent,
      },
      {
        path: 'mayormenor',
        component: MayormenorComponent,
      },
      {
        path: 'colorcontraste',
        component: ColorcontrasteComponent,
      },
    ],
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
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];
