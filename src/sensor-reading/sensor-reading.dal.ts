import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { SensorReadingQueryParams } from 'src/dtos/sensor-reading-query-params.dto';
import { SensorReading } from 'src/entities/sensor-reading.entity';

@Injectable()
export class SensorReadingDal {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSensorReading: SensorReadingCreateDto) {
    return this.prisma.sensorReading.create({
      data: createSensorReading as SensorReading,
    });
  }

  async getSensor(sensorId: string) {
    return this.prisma.sensor.findUnique({ where: { id: sensorId } });
  }

  // async findAllReadings() {
  //   return this.prisma.sensorReading.findMany({
  //     include: {
  //       sensor: true,
  //     },
  //   });
  // }

  async getReadingsBySensorId(
    sensorId: string,
    queryParams: SensorReadingQueryParams,
  ) {
    const whereCondition = {
      sensorId,
      ...(queryParams.startDate && {
        dateTime: { gte: queryParams.startDate },
      }),
      ...(queryParams.endDate && { dateTime: { lte: queryParams.endDate } }),
    };

    return this.prisma.sensorReading.findMany({
      where: whereCondition,
      include: {
        sensor: true,
      },
    });
  }

  // TODO: add types
  async getLatestReading(sensorId: string): Promise<any> {
    return this.prisma.sensorReading.findFirst({
      where: { sensorId },
      orderBy: {
        dateTime: 'desc',
      },
      take: 1,
      include: {
        sensor: true,
      },
    });
  }
}
