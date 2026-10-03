import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@cleancare/types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const Public = () => SetMetadata('isPublic', true);
