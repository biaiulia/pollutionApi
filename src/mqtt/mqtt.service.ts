import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { MqttTopicsEnum } from 'src/enums/mqtt-topics.enum';
import { NotificationService } from 'src/notifications/notification.service';

/* when mqtt service pushes the mqtt data because data change flow:
  1. add sensor readings in db and invalidate redis cache add the new one
  2. send notification
  */

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor(private readonly notificationService: NotificationService) {
    this.client = mqtt.connect('mqtts://localhost:8883', {
      // Update with your actual paths and settings
      ca: process.env.MQTT_CA_CERT,
      cert: process.env.MQTT_CLIENT_CERT,
      key: process.env.MQTT_CLIENT_KEY,
      rejectUnauthorized: false,
    });

    this.client.on('connect', () => {
      console.log('MQTT connected');
    });

    this.client.on('error', (error) => {
      console.error('MQTT connection error:', error);
    });

    this.subscribeToTopics();
  }

  subscribeToTopics() {
    const topics: mqtt.ISubscriptionMap = {
      notifications: { qos: 2 },
      pollution_data: { qos: 2 },
    };
    this.client.subscribe(topics, (error, granted) => {
      if (error) {
        console.error('MQTT subscribe error:', error);
        return;
      }
      granted.forEach((grant) => {
        console.log(`Subscribed to ${grant.topic} with QoS ${grant.qos}`);
      });
    });

    this.client.on('message', (topic, message) => {
      console.log(
        `Message received: Topic: ${topic}, Message: ${message.toString()}`,
      );
      this.handleMessage(topic, message);
    });
  }

  private handleMessage(topic: string, message: Buffer) {
    if (topic === MqttTopicsEnum.NOTIFICATIONS) {
    } else if (topic === MqttTopicsEnum.POLLUTION_DATA) {
      console.log(message);
    }
    //   const payload = message.toString();
    //   console.log(payload);
    //   try {
    //     const data: SensorReadingCreateDto = JSON.parse(payload);

    //     this.notificationService.sendNotification(data);
    //     console.log('Handled notifications:', payload);
    //   } catch (error) {
    //     console.error('Failed to parse message payload:', error);
    //   }
    // }
  }
}
