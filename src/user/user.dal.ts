import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserDal {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        role: 'user',
        isEmailVerified: false,
        expoNotificationsApiKey: '',
      },
    });
  }

  async verifyUser(email: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updatePassword(email: string, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }
}
