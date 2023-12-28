import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTarget {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    required: true,
  })
  until: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  targetQuantity: number;
}
