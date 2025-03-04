import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'src/types/payload';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true; // If no roles are set, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user: JwtPayload = request.user;
        return user && requiredRoles.includes(user.role);

    }
}
