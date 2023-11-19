import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRole } from './enums/user-role.enum';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAllSafe();
  }
}
