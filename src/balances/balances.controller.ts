import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserRole } from '../users/enums/user-role.enum';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('balances')
@UseGuards(AuthGuard)
@ApiTags('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Post()
  create(@UserMeta() meta: UserMetadata, @Body() dto: CreateBalanceDto) {
    let ownerId = meta.userId;

    if (meta.userRole === UserRole.ADMIN) {
      ownerId = dto.userId ?? meta.userId;
    }

    return this.balancesService.create(ownerId, dto);
  }

  @Get()
  findAll(@UserMeta() meta: UserMetadata) {
    return this.balancesService.findAll(meta);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.balancesService.findOneSafe(id, meta);
  }

  @Patch()
  update(@Body() dto: UpdateBalanceDto, @UserMeta() meta: UserMetadata) {
    return this.balancesService.update(dto, meta);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.balancesService.remove(id, meta);
  }
}
