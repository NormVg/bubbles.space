import crypto from 'crypto';
import { db } from '../../db';
import { user } from '../../db/schema';
import { eq } from 'drizzle-orm';

const WEBHOOK_SECRET = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string, timestamp: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('base64');
  
  const providedSig = signature.split(',')[1];
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(providedSig || '')
  );
}

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Missing body' });
  }

  const signature = getHeader(event, 'webhook-signature') || '';
  const timestamp = getHeader(event, 'webhook-timestamp') || '';

  // Verify signature (only if secret is provided, useful to skip in local dev without it if needed, but best practice requires it)
  if (WEBHOOK_SECRET && !verifySignature(body, signature, timestamp)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' });
  }

  // Check timestamp to prevent replay attacks (5 minute tolerance)
  const eventTime = parseInt(timestamp) * 1000;
  if (Math.abs(Date.now() - eventTime) > 300000) {
    throw createError({ statusCode: 401, statusMessage: 'Timestamp too old' });
  }

  const dodoEvent = JSON.parse(body);

  if (dodoEvent.type === 'payment.succeeded') {
    const data = dodoEvent.data;
    const metadata = data.metadata || {};
    const customer = data.customer || {};
    const userId = metadata.userId;
    const passType = metadata.passType;
    
    if (userId && passType) {
      await db.update(user)
        .set({ specialPass: passType })
        .where(eq(user.id, userId));
        
      console.log(`Updated user ${userId} with special pass: ${passType}`);
    } else if (customer.email && data.product_id) {
      // Fallback
      let detectedPass = null;
      if (data.product_id === 'pdt_0Nj3sXtreOCBO9FfqX4BV') detectedPass = 'founder_pass';
      if (data.product_id === 'pdt_0Nj3t8se27z6xiGnjSQ3j') detectedPass = 'sponsor';
      
      if (detectedPass) {
        await db.update(user)
          .set({ specialPass: detectedPass })
          .where(eq(user.email, customer.email));
          
        console.log(`Updated user ${customer.email} with special pass: ${detectedPass}`);
      }
    }
  }

  return { received: true };
});
