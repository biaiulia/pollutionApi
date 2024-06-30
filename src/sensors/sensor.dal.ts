import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorDal {
  constructor(private readonly prisma: PrismaService) {}

  async findById(sensorId: string) {
    return this.prisma.sensor.findUnique({
      where: { id: sensorId },
    });
  }

  async findAllReadings() {
    return this.prisma.sensorReading.findMany();
  }

  async findReadingsBySensorId(sensorId: string) {
    return this.prisma.sensorReading.findMany({
      where: { sensorId },
    });
  }
}
