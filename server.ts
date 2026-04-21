import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-03-25.dahlia', // using latest or existing
});

const app = express();
const port = 3001;

app.use(cors());

// Webhook endpoint needs raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // For local testing without webhook secret, just parse JSON manually
      event = JSON.parse(req.body.toString());
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      console.log('Checkout session complete:', checkoutSessionCompleted);
      // Here you would typically update the user's tier in Supabase
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

// Use JSON body parser for all other routes
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  const { plan } = req.body; // 'standard' or 'pro'

  let priceId = '';

  if (plan === 'standard') {
    priceId = process.env.STRIPE_PRICE_STANDARD || '';
  } else if (plan === 'pro') {
    priceId = process.env.STRIPE_PRICE_PRO || '';
  } else {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  if (!priceId) {
    return res.status(500).json({ error: 'Price ID is not configured.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Assuming localhost:3000 for local development frontend
      success_url: `http://localhost:3000/?success=true`,
      cancel_url: `http://localhost:3000/?canceled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Webhook endpoint is ready at http://localhost:${port}/api/webhook`);
});
