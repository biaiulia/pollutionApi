import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSensorDto } from '../dtos/create-sensor.dto';

@Injectable()
export class SensorDal {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSensorDto: CreateSensorDto) {
    return this.prisma.sensor.create({
      data: createSensorDto,
    });
  }

  async findAllReadings() {
    return this.prisma.sensorReading.findMany({
      include: {
        sensor: true,
      },
    });
  }

  async findReadingsBySensorId(sensorId: string) {
    return this.prisma.sensorReading.findMany({
      where: { sensorId },
      include: {
        sensor: true,
      },
    });
  }
}
