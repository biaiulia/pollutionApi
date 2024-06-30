import { SensorReading } from './sensor-reading.entity';
import { Subscription } from './subscription.entity';

export interface Sensor {
  id: string;
  type: string;
  originalId: string;
  readings?: SensorReading[];
  subscriptions?: Subscription[];
}
