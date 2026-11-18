import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Player, PlayerService } from '../../services/player/player';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
})
export class PlayerComponent implements OnInit {
  player?: Player;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly playerService: PlayerService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) {
      this.errorMessage = 'El identificador del jugador no es válido.';
      this.isLoading = false;
      return;
    }

    this.playerService.getPlayer(id).subscribe({
      next: (player) => {
        this.player = player;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el jugador.';
        this.isLoading = false;
      },
    });
  }
}
