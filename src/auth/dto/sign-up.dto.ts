import { SignInDto } from './sign-in.dto';
import { IsOptional } from 'class-validator';

export class SignUpDto extends SignInDto {
  @IsOptional()
  username: string;
}
