import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SensorReadingCreateDto } from '../dtos/sensor-reading-create.dto';

@Injectable()
export class SensorReadingDal {
  constructor(private readonly prisma: PrismaService) {}

  async create(sensorReading: SensorReadingCreateDto) {
    return this.prisma.sensorReading.create({
      data: sensorReading,
    });
  }

  async findAll() {
    return this.prisma.sensorReading.findMany({
      include: {
        sensor: true,
      },
    });
  }

  async findBySensorId(sensorId: string) {
    return this.prisma.sensorReading.findMany({
      where: { sensorId },
      include: {
        sensor: true,
      },
    });
  }

  async findFirstBySensorIdAndDateTime(sensorId: string, dateTime: Date) {
    return this.prisma.sensorReading.findFirst({
      where: { sensorId, dateTime },
    });
  }
}
