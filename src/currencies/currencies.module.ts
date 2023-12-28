import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { Currency } from './entities/currency.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Currency])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
