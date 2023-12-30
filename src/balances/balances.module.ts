import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Balance } from './entities/balance.entity';
import { UsersModule } from '../users/users.module';
import { LimitsModule } from '../limits/limits.module';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Balance]),
    UsersModule,
    LimitsModule,
    CurrenciesModule,
    LimitsModule,
  ],
  controllers: [BalancesController],
  providers: [BalancesService],
  exports: [BalancesService],
})
export class BalancesModule {}
