import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MikroOrmCoreModule } from '@mikro-orm/nestjs/mikro-orm-core.module';
import { config } from './config';
import defineConfig from './mikro-orm.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.forRootFromConfig(),
    MikroOrmCoreModule.forRoot(defineConfig),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
