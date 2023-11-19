import { IsEmail, IsString, Max, Min } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

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
