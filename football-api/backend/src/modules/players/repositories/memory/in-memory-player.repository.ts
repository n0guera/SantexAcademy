import { Player } from '../../entities/player.entity';
import {
  IPlayerRepository,
  PaginatedPlayers,
} from '../../interfaces/player-repository.interface';
import { PlayerQueryDto } from '../../dto/player-query.dto';

export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async findAll(): Promise<Player[]> {
    return Promise.resolve([...this.players]);
  }

  async findOneById(id: number): Promise<Player | undefined> {
    return Promise.resolve(this.players.find((p) => p.id === id));
  }

  async findPaginated(_query: PlayerQueryDto): Promise<PaginatedPlayers> {
    throw new Error('Paginación no implementada en el repositorio en memoria');
  }
}
