import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  club?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  position: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nationality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  fifaVersion?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  rating: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  speed?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  shooting?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  passing?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  dribbling?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  defending?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  physic?: number;
}
