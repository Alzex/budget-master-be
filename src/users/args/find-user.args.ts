import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FindUserArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
  })
  id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  username?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    enum: UserRole,
    required: false,
  })
  role?: UserRole;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;
}
