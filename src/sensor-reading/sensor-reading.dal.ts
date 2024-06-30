import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { SensorReading } from 'src/entities/sensor-reading.entity';

@Injectable()
export class SensorReadingDal {
  constructor(private prisma: PrismaService) {}

  async getSensorReadings(): Promise<SensorReading[]> {
    return this.prisma.sensorReading.findMany({
      include: { sensor: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async saveSensorReading(
    data: SensorReadingCreateDto,
  ): Promise<SensorReading> {
    const prismaData = {
      dateTime: data.dateTime,
      PM25: data.PM25,
      PM10: data.PM10,
      PM1: data.PM1,
      temperature: data.temperature,
      humidity: data.humidity,
      pressure: data.pressure,
      dayOfWeek: data.dayOfWeek,
      aqiLevel: data.aqiLevel ?? '',
      sensor: {
        connect: { id: data.sensorId },
      },
    };

    return this.prisma.sensorReading.create({
      data: prismaData,
    });
  }
}
