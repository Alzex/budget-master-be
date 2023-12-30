import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindLimitArgs } from './args/find-limit.args';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LimitsService } from './limits.service';
import { CreateLimitDto } from './dto/create-limit.dto';
import { UpdateLimitDto } from './dto/update-limit.dto';

@Controller('limits')
@ApiTags('limits')
@UseGuards(AuthGuard)
export class LimitsController {
  constructor(private readonly limitsService: LimitsService) {}

  @Get()
  findAll(@Query() args: FindLimitArgs, @UserMeta() meta: UserMetadata) {
    return this.limitsService.findAll(args, meta);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.limitsService.findOneSafe(id, meta);
  }

  @Post()
  create(@Body() dto: CreateLimitDto, @UserMeta() meta: UserMetadata) {
    return this.limitsService.create(dto, meta);
  }

  @Patch()
  update(@Body() dto: UpdateLimitDto, @UserMeta() meta: UserMetadata) {
    return this.limitsService.update(dto, meta);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.limitsService.remove(id, meta);
  }
}
