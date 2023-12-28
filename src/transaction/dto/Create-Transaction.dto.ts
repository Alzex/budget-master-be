import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTargetDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  balanceId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  targetId: number;

  @ApiProperty()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsBoolean()
  ignore: boolean;
}
