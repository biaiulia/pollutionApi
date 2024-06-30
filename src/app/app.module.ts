import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import jwtConfig from 'src/auth/jwt.config';
import { MailModule } from 'src/mail/mail.module';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorReadingModule } from 'src/sensor-reading/sensor-reading.module';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { SensorModule } from 'src/sensors/sensor.module';
import { GlobalCacheModule } from 'src/redis/global-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    // GlobalCacheModule,
    UserModule,
    AuthModule,
    MailModule,
    NotificationModule,
    SensorReadingModule,
    SensorModule,
    MqttModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    Reflector,
  ],
})
export class AppModule {}
