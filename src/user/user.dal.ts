import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/entities/user.entity';
import { UserRoleEnum } from 'src/enums/user-role.enum';

@Injectable()
export class UserDal {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    email: string,
    password: string,
    role: UserRoleEnum,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        role,
        isEmailVerified: false,
        expoNotificationsApiKey: '',
      },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        expoNotificationsApiKey: true,
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

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updatePassword(email: string, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }

  async saveExpoToken(userId: string, expoToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { expoNotificationsApiKey: expoToken },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        expoNotificationsApiKey: true,
      },
    });
  }
}
