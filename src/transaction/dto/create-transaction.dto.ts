import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  type: TransactionType;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  balanceId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  targetId: number;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  categoryId?: number;

  @ApiProperty()
  @IsBoolean()
  ignoreLimit: boolean;
}
