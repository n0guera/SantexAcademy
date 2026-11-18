import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IPlayerRepository } from './interfaces/player-repository.interface';
import { Player } from './entities/player.entity';
import { PlayerQueryDto } from './dto/player-query.dto';
import { PaginatedPlayers } from './interfaces/player-repository.interface';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

const MAX_EXPORT_ROWS = 10_000;

@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) {}

  getPlayerById(id: number): Promise<Player | undefined> {
    return this.playerRepository.findOneById(id);
  }

  getPlayers(query: PlayerQueryDto): Promise<PaginatedPlayers> {
    return this.playerRepository.findPaginated(query);
  }

  createPlayer(dto: CreatePlayerDto): Promise<Player> {
    if (!this.playerRepository.create) {
      throw new InternalServerErrorException(
        'El repositorio activo no soporta crear jugadores',
      );
    }

    return this.playerRepository.create(dto);
  }

  updatePlayer(id: number, dto: UpdatePlayerDto): Promise<Player | undefined> {
    if (!this.playerRepository.update) {
      throw new InternalServerErrorException(
        'El repositorio activo no soporta editar jugadores',
      );
    }

    return this.playerRepository.update(id, dto);
  }

  async exportPlayers(query: PlayerQueryDto): Promise<string> {
    if (!this.playerRepository.findForExport) {
      throw new InternalServerErrorException(
        'El repositorio activo no soporta exportación',
      );
    }

    const players = await this.playerRepository.findForExport(
      query,
      MAX_EXPORT_ROWS + 1,
    );

    if (players.length > MAX_EXPORT_ROWS) {
      throw new BadRequestException(
        `La exportación no puede superar las ${MAX_EXPORT_ROWS} filas`,
      );
    }

    const headers = [
      'id',
      'name',
      'club',
      'position',
      'nationality',
      'rating',
      'speed',
      'shooting',
      'dribbling',
      'passing',
    ];
    const rows = players.map((player) =>
      [
        player.id,
        player.name,
        player.club,
        player.position,
        player.nationality,
        player.rating,
        player.speed,
        player.shooting,
        player.dribbling,
        player.passing,
      ]
        .map((value) => this.escapeCsvValue(value))
        .join(','),
    );

    return [headers.join(','), ...rows].join('\r\n');
  }

  private escapeCsvValue(value: string | number): string {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }
}
