import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sensor } from 'src/entities/sensor.entity';

@Injectable()
export class SensorDal {
  constructor(private readonly prisma: PrismaService) {}

  async findById(sensorId: string): Promise<Sensor> {
    return this.prisma.sensor.findUnique({
      where: { id: sensorId },
    });
  }

  async findAll(): Promise<Sensor[]> {
    return this.prisma.sensor.findMany();
  }
}
