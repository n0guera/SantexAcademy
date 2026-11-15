import {
  AutoIncrement,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PlayerIdentityModel } from './player-identity.model';

@Table({ tableName: 'player_versions', timestamps: false })
export class PlayerVersionModel extends Model<PlayerVersionModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => PlayerIdentityModel)
  @Column({ field: 'player_id', type: DataType.INTEGER, allowNull: false })
  declare playerId: number;

  @Column({ field: 'fifa_version', type: DataType.STRING(20), allowNull: false })
  declare fifaVersion: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare age?: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare club?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare position?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare rating?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare pace?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare shooting?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare passing?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare dribbling?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare defending?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare physic?: number;

  @BelongsTo(() => PlayerIdentityModel, {
    foreignKey: 'playerId',
    targetKey: 'id',
  })
  declare player: PlayerIdentityModel;
}
