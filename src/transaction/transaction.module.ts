import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from '../users/users.module';
import { BalancesModule } from '../balances/balances.module';
import { LimitsModule } from '../limits/limits.module';
import { CategoryModule } from '../category/category.module';
import { TargetModule } from '../target/target.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Transaction]),
    UsersModule,
    BalancesModule,
    LimitsModule,
    CategoryModule,
    TargetModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
