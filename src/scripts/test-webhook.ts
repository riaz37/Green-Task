import crypto from 'node:crypto';
import https from 'node:https';
import http from 'node:http';

// Configuration
const WEBHOOK_URL = 'http://localhost:3000/api/webhook';
const WEBHOOK_SECRET = 'helloworld';

// Webhook payload
const payload = {
  eventType: 'test',
  data: {
    key: 'value',
    timestamp: new Date().toISOString()
  }
};

// Generate signature
function generateSignature(secret: string, data: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  return hmac.update(data).digest('hex');
}

// Send webhook request
function sendWebhook() {
  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(WEBHOOK_SECRET, payloadString);

  const parsedUrl = new URL(WEBHOOK_URL);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 3000,  // Default to 3000 if no port specified
    path: parsedUrl.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-signature': signature,
      'Content-Length': Buffer.byteLength(payloadString)
    }
  };

  const req = (parsedUrl.protocol === 'https:' ? https : http).request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Response Data:', responseData);
      console.log('Webhook request completed');
    });
  });

  req.on('error', (error) => {
    console.error('Webhook request error:', error);
    console.error('Possible causes:');
    console.error('1. Next.js server not running');
    console.error('2. Incorrect webhook endpoint');
    console.error('3. Firewall or port blocking');
  });

  req.write(payloadString);
  req.end();
}

// Run the webhook test
sendWebhook();