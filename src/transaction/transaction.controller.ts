import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
@Controller('transaction')
@ApiTags('transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @UserMeta() meta: UserMetadata) {
    return this.transactionService.create(dto, meta);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.transactionService.findOneSafe(id, meta);
  }

  @Get()
  find(@UserMeta() meta: UserMetadata) {
    return this.transactionService.find(meta);
  }
}
