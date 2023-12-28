import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Currency } from './entities/currency.entity';

@Controller('currencies')
@ApiTags('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns all currencies',
    type: Currency,
    isArray: true,
  })
  findAll() {
    return this.currenciesService.findManyCached();
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Currency has been successfully created',
    type: Currency,
  })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.upsert(createCurrencyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Currency has been successfully deleted',
    type: Currency,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.currenciesService.deleteOne({
      id,
    });
  }
}
