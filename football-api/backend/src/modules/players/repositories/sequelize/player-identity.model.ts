import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PlayerVersionModel } from './player-version.model';

@Table({ tableName: 'player_identities', timestamps: false })
export class PlayerIdentityModel extends Model<PlayerIdentityModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare nationality?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare gender?: string;

  @HasMany(() => PlayerVersionModel, {
    foreignKey: 'playerId',
    sourceKey: 'id',
  })
  declare versions: PlayerVersionModel[];
}
