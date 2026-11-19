import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { PlayerComponent } from './components/player/player';
import { PlayersComponent } from './components/players/players';
import { PlayerFormComponent } from './components/player-form/player-form';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'players', component: PlayersComponent, canActivate: [authGuard] },
  { path: 'players/new', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: 'players/:id/edit', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: 'players/:id', component: PlayerComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
