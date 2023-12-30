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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { TargetService } from './target.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Target } from './entities/target.entity';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';

@Controller('target')
@ApiTags('target')
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
    return this.targetService.find(meta);
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
    return this.targetService.createTarget(createTargetDto, meta);
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
    return this.targetService.updateTarget(updateTargetDto, meta);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deleted a target',
    type: Target,
  })
  deleteTarget(
    @Param('id', ParseIntPipe) id: number,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.targetService.deleteTarget(id, meta);
  }
}
