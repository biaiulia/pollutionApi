import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor() {
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
    const topics = ['notifications', 'sensor_data'];
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
    // Handle the incoming message based on the topic
    if (topic === 'notifications') {
      this.handleNotifications(message);
    } else if (topic === 'sensor_data') {
      this.handleSensorData(message);
    }
  }

  private handleNotifications(message: Buffer) {
    const payload = message.toString();
    console.log('Handling notifications:', payload);
    // Add your notification handling logic here
  }

  private handleSensorData(message: Buffer) {
    const payload = message.toString();
    console.log('Handling sensor data:', payload);
    // Add your sensor data handling logic here
  }
}
