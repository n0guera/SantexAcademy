import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Player, PlayerService } from '../../services/player/player';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
})
export class PlayerComponent implements OnInit {
  @ViewChild('skillsChart') skillsChart?: ElementRef<HTMLCanvasElement>;
  player?: Player;
  private chart?: Chart;
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
        setTimeout(() => this.renderSkillsChart(), 0);
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el jugador.';
        this.isLoading = false;
      },
    });
  }

  private renderSkillsChart(): void {
    if (!this.player || !this.skillsChart) {
      return;
    }

    this.chart?.destroy();
    this.chart = new Chart(this.skillsChart.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Ritmo', 'Tiro', 'Pases', 'Regate', 'Rating'],
        datasets: [{
          label: this.player.name,
          data: [
            this.player.speed,
            this.player.shooting,
            this.player.passing,
            this.player.dribbling,
            this.player.rating,
          ],
          backgroundColor: 'rgba(13, 110, 253, 0.25)',
          borderColor: '#0d6efd',
          pointBackgroundColor: '#0d6efd',
        }],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#cbd5e1', backdropColor: 'transparent' },
            pointLabels: { color: '#f8f9fa' },
            grid: { color: '#385175' },
            angleLines: { color: '#385175' },
          },
        },
        plugins: {
          legend: { labels: { color: '#f8f9fa' } },
        },
      },
    });
  }
}
