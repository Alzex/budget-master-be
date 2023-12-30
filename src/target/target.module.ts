import { Module } from '@nestjs/common';
import { TargetService } from './target.service';
import { TargetController } from './target.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Target } from './entities/target.entity';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [MikroOrmModule.forFeature([Target]), UsersModule],
  providers: [TargetService],
  controllers: [TargetController],
  exports: [TargetService],
})
export class TargetModule {}
