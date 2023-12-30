import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateTargetDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsDate()
  until?: Date;

  @ApiProperty()
  @IsNumber()
  targetQuantity?: number;

  @ApiProperty()
  @IsString()
  description?: string;
}
