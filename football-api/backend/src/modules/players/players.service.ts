import {
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
}
