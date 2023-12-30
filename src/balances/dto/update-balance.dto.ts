import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBalanceDto } from './create-balance.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateBalanceDto extends PartialType(
  OmitType(CreateBalanceDto, ['userId'] as const),
) {
  @IsInt()
  @Min(1)
  id: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  amount?: number;
}
