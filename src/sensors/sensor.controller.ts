import { Controller, Get } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('token')
@ApiTags('sensors')
@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async getSensors() {
    return this.sensorService.getSensors();
  }
}
