import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRole } from './enums/user-role.enum';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FindUserArgs } from './args/find-user.args';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all users',
    type: User,
    isArray: true,
  })
  findAll(@Query() args?: FindUserArgs) {
    return this.usersService.complexSearch(args);
  }
}
