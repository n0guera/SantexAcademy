import { Inject, Injectable } from '@nestjs/common';
import { IPlayerRepository } from './interfaces/player-repository.interface';
import { Player } from './entities/player.entity';
import { PlayerQueryDto } from './dto/player-query.dto';
import { PaginatedPlayers } from './interfaces/player-repository.interface';

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
}
