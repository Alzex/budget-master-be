import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateLimitDto } from './create-limit.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateLimitDto extends PartialType(
  OmitType(CreateLimitDto, ['userId'] as const),
) {
  @ApiProperty()
  @IsInt()
  @Min(1)
  id: number;
}
