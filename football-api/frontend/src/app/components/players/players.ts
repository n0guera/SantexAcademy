import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import {
  PaginatedPlayers,
  Player,
  PlayerQuery,
  PlayerService,
} from '../../services/player/player';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './players.html',
  styleUrl: './players.css',
})
export class PlayersComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  players: Player[] = [];
  errorMessage = '';
  isLoading = false;
  isDownloading = false;
  total = 0;
  page = 1;
  limit = 10;
  totalPages = 1;

  readonly filters = this.formBuilder.nonNullable.group({
    name: '',
    club: '',
    position: '',
    nationality: '',
    minRating: null as number | null,
    maxRating: null as number | null,
  });

  constructor(
    private readonly playerService: PlayerService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const rawFilters = this.filters.getRawValue();
    const query: PlayerQuery = {
      ...rawFilters,
      minRating: rawFilters.minRating ?? undefined,
      maxRating: rawFilters.maxRating ?? undefined,
      page: this.page,
      limit: this.limit,
      orderBy: 'name',
      order: 'ASC',
    };

    this.playerService.getPlayers(query).subscribe({
      next: (response: PaginatedPlayers) => {
        this.players = response.items;
        this.total = response.total;
        this.page = response.page;
        this.limit = response.limit;
        this.totalPages = Math.max(1, Math.ceil(response.total / response.limit));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el listado de jugadores.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadPlayers();
  }

  clearFilters(): void {
    this.filters.reset();
    this.page = 1;
    this.loadPlayers();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) {
      return;
    }
    this.page = page;
    this.loadPlayers();
  }

  downloadCsv(): void {
    this.isDownloading = true;
    this.errorMessage = '';
    const rawFilters = this.filters.getRawValue();
    this.playerService.exportPlayers({
      ...rawFilters,
      minRating: rawFilters.minRating ?? undefined,
      maxRating: rawFilters.maxRating ?? undefined,
      orderBy: 'name',
      order: 'ASC',
    }).subscribe({
      next: (csv) => {
        const blob = new Blob(['\ufeff', csv], {
          type: 'text/csv;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'players.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        this.isDownloading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo descargar el archivo CSV.';
        this.isDownloading = false;
      },
    });
  }
}
