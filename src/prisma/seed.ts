import { SensorTypeEnum } from 'src/enums/sensor-type.enum';

export const sensorSeedData = [
  {
    id: '13254',
    type: SensorTypeEnum.AIRLY,
    title: 'Airly Victoriei',
    location: 'Calea Victoriei',
    latitude: 44.433696,
    longitude: 26.097924,
  },
  {
    id: '97068',
    type: SensorTypeEnum.NATIONAL,
    title: 'Reteaua Nationala de senzori',
    location: 'Piata Consitutiei',
    latitude: 44.425483,
    longitude: 26.091003,
  },
  {
    id: '115449',
    type: SensorTypeEnum.AIRLY,
    title: 'Airly Sebastian',
    location: 'Strada Mihail Sebastian',
    latitude: 44.417647,
    longitude: 26.071874,
  },
  {
    id: 'edge1',
    type: SensorTypeEnum.EDGE_NODE,
    title: 'Edge Node',
    location: 'Piata Libertatii',
    latitude: 44.4187213,
    longitude: 26.0926972,
  },
];
