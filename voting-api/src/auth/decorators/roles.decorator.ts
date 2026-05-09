import { SetMetadata } from '@nestjs/common';

export const RolesDec = (...roles: string[]) => SetMetadata('roles', roles);
