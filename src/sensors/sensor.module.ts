import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SensorDal } from './sensor.dal';
import { MqttModule } from '../mqtt/mqtt.module';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalCacheModule } from 'src/redis/global-cache.module';
// import { SensorReadingModule } from 'src/sensor-reading/sensor-reading.module';

@Module({
  imports: [PrismaModule, MqttModule, AuthModule, GlobalCacheModule],
  controllers: [SensorController],
  providers: [SensorService, SensorDal],
  exports: [SensorService],
})
export class SensorModule {}
