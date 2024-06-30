import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDal } from './user.dal';
import { User } from '../entities/user.entity';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Injectable()
export class UserService {
  private salt: string;

  constructor(
    private userDal: UserDal,
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {
    this.salt = this.configService.get<string>('PASSWORD_SALT');
  }

  private hashPassword(password: string): string {
    const hash1 = crypto.createHash('sha256').update(password).digest('hex');
    const saltedHash = hash1 + this.salt;
    return crypto.createHash('sha256').update(saltedHash).digest('hex');
  }

  async createUser(createUser: CreateUserDto): Promise<User> {
    const existingUser = await this.findUserByEmail(createUser.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = this.hashPassword(createUser.password);
    const user = await this.userDal.createUser(
      createUser.email,
      hashedPassword,
      createUser.role,
    );

    const verificationToken = this.jwtService.sign({ email: user.email });
    // await this.mailService.sendVerificationEmail(
    //   createUser.email,
    //   verificationToken,
    // );

    return user;
  }

  async verifyUser(token: string): Promise<User> {
    try {
      const { email } = this.jwtService.verify(token);
      const user = await this.userDal.findUserByEmail(email);

      if (user.isEmailVerified) {
        throw new BadRequestException('User already verified');
      }

      return this.userDal.verifyUser(email);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userDal.findUserByEmail(email);
  }

  async updatePassword(email: string, newPassword: string): Promise<User> {
    const user = await this.userDal.findUserByEmail(email);

    const newHashedPassword = this.hashPassword(newPassword);
    if (user.password === newHashedPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    return this.userDal.updatePassword(email, newHashedPassword);
  }

  async login(email: string, password: string) {
    const user = await this.userDal.findUserByEmail(email);

    if (!user || this.hashPassword(password) !== user.password) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
