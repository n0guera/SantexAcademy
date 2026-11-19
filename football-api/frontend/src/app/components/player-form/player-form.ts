import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../services/player/player';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './player-form.html',
})
export class PlayerFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    club: ['', Validators.maxLength(255)],
    position: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    nationality: ['', Validators.maxLength(255)],
    rating: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    speed: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    shooting: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    passing: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    dribbling: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    physic: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  playerId: number | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly playerService: PlayerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.playerId = Number(id);
    this.playerService.getPlayer(this.playerId).subscribe({
      next: (player) => this.form.patchValue(player),
      error: () => {
        this.errorMessage = 'No se pudo cargar el jugador para editar.';
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    const player = this.form.getRawValue();
    const request = this.playerId
      ? this.playerService.updatePlayer(this.playerId, player)
      : this.playerService.createPlayer(player);

    request.subscribe({
      next: (savedPlayer) => {
        this.successMessage = this.playerId
          ? 'Jugador actualizado correctamente.'
          : 'Jugador creado correctamente.';
        this.isSubmitting = false;
        void this.router.navigate(['/players', savedPlayer.id]);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ?? 'No se pudo guardar el jugador.';
        this.isSubmitting = false;
      },
    });
  }
}
