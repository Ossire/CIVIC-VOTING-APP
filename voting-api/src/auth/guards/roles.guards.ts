import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAll<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    return requiredRole.some((role) => user.role?.includes(role));
  }
}
