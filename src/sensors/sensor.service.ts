import { Injectable } from '@nestjs/common';
import { SensorDal } from './sensor.dal';
import { CreateSensorDto } from '../dtos/create-sensor.dto';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class SensorService {
  constructor(
    private readonly sensorDal: SensorDal,
    private readonly mqttService: MqttService,
  ) {}

  async createSensor(createSensorDto: CreateSensorDto) {
    return this.sensorDal.create(createSensorDto);
  }

  async getSensorReadings() {
    return this.sensorDal.findAllReadings();
  }

  async getSensorReadingsBySensorId(sensorId: string) {
    return this.sensorDal.findReadingsBySensorId(sensorId);
  }

  async publishSensorData(sensorId: string, data: any) {
    const topic = `sensors/${sensorId}`;
    this.mqttService.publish(topic, JSON.stringify(data));
  }
}
