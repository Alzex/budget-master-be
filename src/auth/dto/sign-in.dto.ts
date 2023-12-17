import { IsEmail, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString({
    message: 'Password must be a string',
  })
  @Max(20, {
    message: 'Password must be shorter than or equal to 20 characters',
  })
  @Min(8, {
    message: 'Password must be longer than or equal to 8 characters',
  })
  password: string;
}
