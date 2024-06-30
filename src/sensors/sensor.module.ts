import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SensorDal } from './sensor.dal';
import { MqttModule } from '../mqtt/mqtt.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, MqttModule, AuthModule],
  controllers: [SensorController],
  providers: [SensorService, SensorDal],
  exports: [SensorService],
})
export class SensorModule {}
