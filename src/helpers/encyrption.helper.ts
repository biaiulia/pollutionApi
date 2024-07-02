import * as crypto from 'crypto';

const AES_KEY = Buffer.from(process.env.AES_KEY, 'hex');
const AES_IV = Buffer.from(process.env.AES_IV, 'hex');

function encryptData(data: string): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptData(encryptedData: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
