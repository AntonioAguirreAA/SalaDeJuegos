import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { JuegosComponent } from './componentes/juegos/juegos.component';
import { QuiensoyComponent } from './componentes/quiensoy/quiensoy.component';
import { RegistroComponent } from './componentes/registro/registro.component';

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
    path: '**',
    component: HomeComponent,
  },
];
