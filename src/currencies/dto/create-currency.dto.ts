import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @IsString()
  @MaxLength(3)
  @ApiProperty({
    maxLength: 3,
    description: 'Currency ISO code',
  })
  code: string;

  @IsString()
  @ApiProperty({
    description: 'Currency name',
  })
  name: string;
}
