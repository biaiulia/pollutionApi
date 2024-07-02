import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Methods, permissionsByRole } from './permissions';
import { Permissions } from './permissions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, apiKey: { sub: string; email: string }) {
    const { method, path } = req;
    const { sub, email } = apiKey;

    const validatedUser = await this.userService.getUserDetailsByEmailAndId(
      sub,
      email,
    );
    if (!validatedUser) {
      throw new UnauthorizedException();
    }

    const resource = this.getResourceName(path);

    const permissions: Permissions = permissionsByRole[validatedUser.role];
    if (!permissions[resource]) {
      throw new InternalServerErrorException(
        `${resource} is not defined in the permissions as a resource`,
      );
    }

    const hasAccessToResourceAndMethod = permissions[resource].includes(
      method.toUpperCase() as Methods,
    );

    if (!hasAccessToResourceAndMethod)
      throw new UnauthorizedException(
        'User does not have access to this resource',
      );

    return { ...validatedUser, userId: validatedUser.id };
  }

  private getResourceName = (path: string) => {
    const pathParts = path.split('/');
    const firstPartOfPath = pathParts[1];

    const versionPattern = /^v\d+$/;

    // Check if the first part of the path is a version number and return the next part of the path
    if (versionPattern.test(firstPartOfPath)) {
      return pathParts[2];
    }

    return firstPartOfPath;
  };
}
