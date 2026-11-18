import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';
import { PlayerQueryDto } from './dto/player-query.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPlayers(@Query() query: PlayerQueryDto) {
    const result = await this.playersService.getPlayers(query);

    return {
      items: result.items.map((player) => new PlayerDto(player)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="players.csv"')
  @HttpCode(HttpStatus.OK)
  async exportPlayers(@Query() query: PlayerQueryDto) {
    return this.playersService.exportPlayers(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlayerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto> {
    const player = await this.playersService.getPlayerById(id);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }

    return new PlayerDto(player);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<PlayerDto> {
    const player = await this.playersService.createPlayer(createPlayerDto);
    return new PlayerDto(player);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<PlayerDto> {
    const player = await this.playersService.updatePlayer(
      id,
      updatePlayerDto,
    );

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }

    return new PlayerDto(player);
  }
}
