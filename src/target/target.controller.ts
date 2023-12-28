import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TargetService } from './target.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Target } from './entities/target.entity';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-Target.dto';

@Controller('target')
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all targets',
    type: Target,
    isArray: true,
  })
  findAllByUserId(@UserMeta() meta: UserMetadata) {
    return this.targetService.findAllByUserId(meta.userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Created a target',
    type: Target,
  })
  createTarget(
    @UserMeta() meta: UserMetadata,
    @Body() createTargetDto: CreateTargetDto,
  ) {
    return this.targetService.createTarget(meta.userId, createTargetDto);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updated a target',
    type: Target,
  })
  updateTarget(
    @UserMeta() meta: UserMetadata,
    @Body() updateTargetDto: UpdateTargetDto,
  ) {
    return this.targetService.updateTarget(meta.userId, updateTargetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deleted a target',
    type: Target,
  })
  deleteTarget(@Param('id', ParseIntPipe) id: number) {
    return this.targetService.deleteTarget(id);
  }
}
