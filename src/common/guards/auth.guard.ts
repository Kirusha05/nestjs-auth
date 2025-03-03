import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Authorization header is invalid');
    }

    try {
      const tokenClaims = this.jwtService.verify(token);
      request.user = {
        id: tokenClaims.sub,
        email: tokenClaims.email,
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(`Token is invalid: ${error.message}`);
    }
  }
}
