import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { PlayerModel } from './player.model'; // Sequelize model
import {
  IPlayerRepository,
  PaginatedPlayers,
} from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';
import { PlayerQueryDto } from '../../dto/player-query.dto';
import { CreatePlayerDto } from '../../dto/create-player.dto';
import { UpdatePlayerDto } from '../../dto/update-player.dto';

@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

  async findAll(): Promise<Player[]> {
    const playerList = await this.playerModel.findAll();
    return playerList.map((x) => this.mapToEntity(x));
  }

  async findPaginated(query: PlayerQueryDto): Promise<PaginatedPlayers> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const { where, order } = this.buildQueryOptions(query);

    const result = await this.playerModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      ...(order ? { order } : {}),
    });

    return {
      items: result.rows.map((model) => this.mapToEntity(model)),
      total: result.count,
      page,
      limit,
    };
  }

  async findForExport(
    query: PlayerQueryDto,
    limit: number,
  ): Promise<Player[]> {
    const { where, order } = this.buildQueryOptions(query);
    const playerList = await this.playerModel.findAll({
      where,
      limit,
      ...(order ? { order } : {}),
    });

    return playerList.map((model) => this.mapToEntity(model));
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) {
      return undefined;
    }
    return this.mapToEntity(model);
  }

  async create(dto: CreatePlayerDto): Promise<Player> {
    const model = await this.playerModel.create({
      fifaVersion: dto.fifaVersion ?? '23',
      fifaUpdate: '2',
      playerFaceUrl: '',
      longName: dto.name,
      playerPositions: dto.position,
      clubName: dto.club,
      nationalityName: dto.nationality,
      overall: dto.rating,
      potential: dto.rating,
      age: 0,
      pace: dto.speed,
      shooting: dto.shooting,
      passing: dto.passing,
      dribbling: dto.dribbling,
      defending: dto.defending,
      physic: dto.physic,
    });

    return this.mapToEntity(model);
  }

  async update(
    id: number,
    dto: UpdatePlayerDto,
  ): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) {
      return undefined;
    }

    await model.update({
      ...(dto.name !== undefined ? { longName: dto.name } : {}),
      ...(dto.club !== undefined ? { clubName: dto.club } : {}),
      ...(dto.position !== undefined
        ? { playerPositions: dto.position }
        : {}),
      ...(dto.nationality !== undefined
        ? { nationalityName: dto.nationality }
        : {}),
      ...(dto.fifaVersion !== undefined
        ? { fifaVersion: dto.fifaVersion }
        : {}),
      ...(dto.rating !== undefined ? { overall: dto.rating } : {}),
      ...(dto.speed !== undefined ? { pace: dto.speed } : {}),
      ...(dto.shooting !== undefined ? { shooting: dto.shooting } : {}),
      ...(dto.passing !== undefined ? { passing: dto.passing } : {}),
      ...(dto.dribbling !== undefined ? { dribbling: dto.dribbling } : {}),
      ...(dto.defending !== undefined ? { defending: dto.defending } : {}),
      ...(dto.physic !== undefined ? { physic: dto.physic } : {}),
    });

    return this.mapToEntity(model);
  }

  private buildQueryOptions(query: PlayerQueryDto): {
    where: WhereOptions;
    order?: [string, 'ASC' | 'DESC'][];
  } {
    const where: WhereOptions = {};

    if (query.name) {
      where.longName = { [Op.like]: `%${query.name}%` };
    }
    if (query.club) {
      where.clubName = { [Op.like]: `%${query.club}%` };
    }
    if (query.position) {
      where.playerPositions = { [Op.like]: `%${query.position}%` };
    }
    if (query.nationality) {
      where.nationalityName = { [Op.like]: `%${query.nationality}%` };
    }
    if (query.fifaVersion) {
      where.fifaVersion = query.fifaVersion;
    }
    if (query.minRating !== undefined || query.maxRating !== undefined) {
      where.overall = {
        ...(query.minRating !== undefined ? { [Op.gte]: query.minRating } : {}),
        ...(query.maxRating !== undefined ? { [Op.lte]: query.maxRating } : {}),
      };
    }

    const allowedOrderFields: Record<string, string> = {
      name: 'long_name',
      club: 'club_name',
      position: 'player_positions',
      nationality: 'nationality_name',
      rating: 'overall',
      fifaVersion: 'fifa_version',
    };
    const orderField = query.orderBy
      ? allowedOrderFields[query.orderBy]
      : undefined;

    return {
      where,
      ...(orderField
        ? {
            order: [
              [orderField, query.order === 'DESC' ? 'DESC' : 'ASC'],
            ],
          }
        : {}),
    };
  }

  private mapToEntity(model: PlayerModel): Player {
    console.log('Mapping PlayerModel to Player entity:', model);
    if (!model) {
      throw new Error('Attempted to map null model to Player entity');
    }
    const player = new Player();
    player.id = model.id;
    player.name = model.longName;
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';
    player.rating = model.overall;
    player.speed = model.pace ?? 0;
    player.shooting = model.shooting ?? 0;
    player.dribbling = model.dribbling ?? 0;
    player.passing = model.passing ?? 0;

    return player;
  }
}
