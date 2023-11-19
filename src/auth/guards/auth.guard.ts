import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!('authorization' in request.headers)) {
      throw new UnauthorizedException();
    }

    const token = request.headers.authorization.split(' ')[1];

    const payload = this.authService.validate(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid auth token');
    }

    request.userId = payload.sub;
    request.userRole = payload.role;
    request.userEmail = payload.email;

    return true;
  }
}
