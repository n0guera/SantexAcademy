import { Player } from '../entities/player.entity';
import { PlayerQueryDto } from '../dto/player-query.dto';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';

export interface PaginatedPlayers {
  items: Player[];
  total: number;
  page: number;
  limit: number;
}

export interface IPlayerRepository {
  findAll(): Promise<Player[]>;
  findOneById(id: number): Promise<Player | undefined>;
  findPaginated(query: PlayerQueryDto): Promise<PaginatedPlayers>;
  create?(dto: CreatePlayerDto): Promise<Player>;
  update?(id: number, dto: UpdatePlayerDto): Promise<Player | undefined>;
}
