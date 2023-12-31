import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRole } from './enums/user-role.enum';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FindUserArgs } from './args/find-user.args';
import { UserMeta } from '../auth/decorator/user-meta.decorator';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserAnalyticsDto } from './dto/user-analytics.dto';
import { UserAnalyticsArgs } from './args/user-analytics.args';

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all users',
    type: User,
    isArray: true,
  })
  findAll(@Query() args: FindUserArgs) {
    return this.usersService.complexSearch(args);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the current user',
    type: User,
  })
  getMe(@UserMeta() meta: UserMetadata) {
    return this.usersService.findOneByIdSafe(meta.userId);
  }

  @Get('analytics')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the current user',
    type: User,
  })
  getAnalytics(
    @Query() args: UserAnalyticsArgs,
    @UserMeta() meta: UserMetadata,
  ) {
    return this.usersService.calculateAnalytics(meta.userId, args);
  }
}
