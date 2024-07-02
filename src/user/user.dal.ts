import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/entities/user.entity';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { USER_SELECTOR } from './user.selector';

@Injectable()
export class UserDal {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string, password: string): Promise<Partial<User>> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        role: UserRoleEnum.USER,
        isEmailVerified: false,
        expoNotificationsApiKey: '',
      },
      select: {
        ...USER_SELECTOR,
      },
    });
  }

  async verifyUser(email: string): Promise<Partial<User>> {
    return this.prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
      select: {
        ...USER_SELECTOR,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findLoginUser(email: string, password: string): Promise<Partial<User>> {
    return this.prisma.user.findUnique({
      where: { email, password },
      select: {
        ...USER_SELECTOR,
      },
    });
  }

  async findById(id: string): Promise<Partial<User>> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_SELECTOR,
      },
    });
  }

  async updatePassword(
    email: string,
    newPassword: string,
  ): Promise<Partial<User>> {
    return this.prisma.user.update({
      where: { email },
      data: { password: newPassword },
      select: {
        ...USER_SELECTOR,
      },
    });
  }

  async saveExpoToken(
    userId: string,
    expoToken: string,
  ): Promise<Partial<User>> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { expoNotificationsApiKey: expoToken },
      select: {
        ...USER_SELECTOR,
      },
    });
  }

  async findByIdAndEmail(
    userId: string,
    email: string,
  ): Promise<Partial<User>> {
    return this.prisma.user.findUnique({
      where: { id: userId, email },
      select: { ...USER_SELECTOR, role: true },
    });
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
