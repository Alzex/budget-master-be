import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MikroOrmCoreModule } from '@mikro-orm/nestjs/mikro-orm-core.module';
import { config } from './config';
import defineConfig from './mikro-orm.config';
import { JwtModule } from '@nestjs/jwt';
import { LimitsModule } from './limits/limits.module';
import { BalancesModule } from './balances/balances.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { TargetModule } from './target/target.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CacheModule.forRootFromConfig(),
    MikroOrmCoreModule.forRoot(defineConfig),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    UsersModule,
    AuthModule,
    LimitsModule,
    BalancesModule,
    CurrenciesModule,
    CategoryModule,
    TransactionModule,
    TargetModule,
  ],
})
export class AppModule {}
