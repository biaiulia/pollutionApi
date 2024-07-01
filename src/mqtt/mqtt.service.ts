import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { MqttTopicsEnum } from 'src/enums/mqtt-topics.enum';
import { NotificationService } from 'src/notifications/notification.service';
import { SensorReadingService } from 'src/sensor-reading/sensor-reading.service';

/* when mqtt service pushes the mqtt data because data change flow:
  1. add sensor readings in db and invalidate redis cache add the new one
  2. send notification
  */

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly sensorReadingService: SensorReadingService,
    private readonly logger: Logger,
  ) {
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
        this.logger.log(`Subscribed to ${grant.topic} with QoS ${grant.qos}`);
      });
    });

    this.client.on('message', (topic, message) => {
      this.logger.log(`Message received: Topic: ${topic}`);
      this.handleMessage(topic, message);
    });
  }

  private handleMessage(topic: string, message: Buffer) {
    const messageString = message.toString();
    try {
      const parsedData = JSON.parse(messageString);
      if (!parsedData) {
        throw new BadRequestException(`Empty mqtt message on topic ${topic}`);
      }
      if (topic === MqttTopicsEnum.NOTIFICATIONS) {
        this.handleNotificationMessage(parsedData);
      } else if (topic === MqttTopicsEnum.POLLUTION_DATA) {
        this.handlePollutionDataMessage(parsedData);
      }
    } catch (error) {
      this.logger.error('Failed to parse message payload:', error);
    }
  }

  private handleNotificationMessage(parsedData: { message: string; data }) {
    const { message, data } = parsedData;
    if (message && data) {
      // Handle the notification message, e.g., log it or send a notification
      this.logger.log('Notification received:', message, data);
      // Implement your notification handling logic here
      this.notificationService.sendNotification(message, data);
    } else {
      this.logger.error('Invalid notification message format');
    }
  }

  private async handlePollutionDataMessage(parsedData: {
    message: string;
    data;
  }) {
    try {
      await Promise.all(
        parsedData.data.map((reading) =>
          this.sensorReadingService.createSensorReading({
            ...reading,
            dateTime: new Date(reading.dateTime),
            sensorId: 'edge1',
          } as SensorReadingCreateDto),
        ),
      );
    } catch (error) {
      this.logger.error('Failed to parse pollution data payload:', error);
    }
  }
}
