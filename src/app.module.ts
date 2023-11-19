import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule.forRootFromConfig()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
