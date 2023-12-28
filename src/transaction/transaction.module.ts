import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Transaction])],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
