import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLimitDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxLoss: number;

  @ApiProperty({ required: false })
  @IsDateString()
  until?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
