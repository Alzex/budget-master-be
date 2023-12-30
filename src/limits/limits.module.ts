import { Module } from '@nestjs/common';
import { LimitsService } from './limits.service';
import { LimitsController } from './limits.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Limit } from './entities/limit.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Limit])],
  controllers: [LimitsController],
  providers: [LimitsService],
  exports: [LimitsService],
})
export class LimitsModule {}
