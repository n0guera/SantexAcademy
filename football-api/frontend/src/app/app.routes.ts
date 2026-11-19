import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((component) => component.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then(
        (component) => component.RegisterComponent,
      ),
  },
  {
    path: 'players',
    loadComponent: () =>
      import('./components/players/players').then((component) => component.PlayersComponent),
    canActivate: [authGuard],
  },
  {
    path: 'players/new',
    loadComponent: () =>
      import('./components/player-form/player-form').then(
        (component) => component.PlayerFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'players/:id/edit',
    loadComponent: () =>
      import('./components/player-form/player-form').then(
        (component) => component.PlayerFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'players/:id',
    loadComponent: () =>
      import('./components/player/player').then((component) => component.PlayerComponent),
    canActivate: [authGuard],
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
