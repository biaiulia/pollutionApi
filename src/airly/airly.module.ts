import { Logger, Module } from '@nestjs/common';
import { AirlyService } from './airly.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [AirlyService, Logger],
  exports: [AirlyService],
})
export class AirlyModule {}
