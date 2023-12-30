import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBalanceDto {
  @IsNumber()
  @Min(1)
  currencyId: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limitId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  userId: number;
}
