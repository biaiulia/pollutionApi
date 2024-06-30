import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor() {
    this.client = mqtt.connect('mqtt://localhost:1883');
  }

  //   publish(topic: string, message: string) {
  //     this.client.publish(topic, message, {}, (error) => {
  //       if (error) {
  //         console.error('MQTT publish error:', error);
  //       }
  //     });
  //   }

  subscribe(topic: string, callback: (topic: string, message: Buffer) => void) {
    this.client.subscribe(topic, (error) => {
      if (error) {
        console.error('MQTT subscribe error:', error);
        return;
      }

      this.client.on('message', (topic, message) => {
        callback(topic, message);
      });
    });
  }
}
