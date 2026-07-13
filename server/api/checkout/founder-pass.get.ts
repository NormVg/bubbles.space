import DodoPayments from 'dodopayments';
import { auth } from '../../utils/auth';
import { db } from '../../db';
import { user } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  
  if (!session?.user) {
    return sendRedirect(event, '/?redirect=founder-pass', 302);
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id)
  });

  if (dbUser?.specialPass === 'founder_pass' || dbUser?.specialPass === 'sponsor') {
    return sendRedirect(event, '/investors?error=already_purchased', 302);
  }

  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Missing DODO_PAYMENTS_API_KEY' });
  }

  const client = new DodoPayments({
    bearerToken: apiKey,
  });

  const productId = 'pdt_0Nj3sXtreOCBO9FfqX4BV';
  
  try {
    const sessionConfig: any = {
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/investors?success=true`,
    };

    if (session?.user) {
      sessionConfig.customer = { email: session.user.email };
      sessionConfig.metadata = { 
        userId: session.user.id,
        passType: 'founder_pass' 
      };
    }

    const dodoSession = await client.checkoutSessions.create(sessionConfig);

    return sendRedirect(event, dodoSession.checkout_url, 302);
  } catch (error: any) {
    console.error('Failed to create Dodo checkout session:', error);
    throw createError({ statusCode: 500, statusMessage: 'Payment provider error' });
  }
});
