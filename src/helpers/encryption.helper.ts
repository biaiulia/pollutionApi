import * as crypto from 'crypto';

// Assuming AES_KEY is retrieved from process.env and is base64-encoded
const rawKey = process.env.AES_KEY!;
const keyBuffer = Buffer.from(rawKey, 'base64'); // Decode from base64 to get the original binary data

if (keyBuffer.length !== 32) {
  throw new Error('Failed saving.');
}

export function encryptData(data: string): string {
  const cipher = crypto.createCipheriv('aes-256-ecb', keyBuffer, null); // ECB mode doesn't use an IV
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptData(encryptedData: string): string {
  const decipher = crypto.createDecipheriv('aes-256-ecb', keyBuffer, null); // ECB mode doesn't use an IV
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
