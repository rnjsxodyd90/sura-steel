// Stripe Webhook Handler
// Handles successful payments and updates inventory
// Requires STRIPE_WEBHOOK_SECRET environment variable

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify webhook signature
    if (webhookSecret) {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        webhookSecret
      );
    } else {
      // For testing without webhook secret
      stripeEvent = JSON.parse(event.body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;
      console.log('Payment successful for session:', session.id);

      // Get line items from the session
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        
        // Update inventory in Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

        if (supabaseUrl && supabaseServiceKey) {
          for (const item of lineItems.data) {
            // Parse product info from name (format: "Product Name (Variant)")
            const nameMatch = item.description.match(/^(.+?)\s*\((.+)\)$/);
            const productName = nameMatch ? nameMatch[1] : item.description;
            const variant = nameMatch ? nameMatch[2] : 'default';

            console.log(`Updating inventory: ${productName} - ${variant} x ${item.quantity}`);

            // Find product and update stock
            // Note: In production, you'd want to store product_id in Stripe metadata
            const response = await fetch(
              `${supabaseUrl}/rest/v1/inventory?product_name=eq.${encodeURIComponent(productName)}&variant=eq.${encodeURIComponent(variant)}`,
              {
                method: 'PATCH',
                headers: {
                  'apikey': supabaseServiceKey,
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                  stock: `stock - ${item.quantity}`,
                }),
              }
            );

            // Alternative: Use RPC function for atomic decrement
            await fetch(`${supabaseUrl}/rest/v1/rpc/decrement_stock`, {
              method: 'POST',
              headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                p_product_name: productName,
                p_variant: variant,
                p_quantity: item.quantity,
              }),
            });
          }
        }

        // TODO: Send order confirmation email here
        console.log('Order processed successfully');

      } catch (error) {
        console.error('Error processing order:', error);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = stripeEvent.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ received: true }),
  };
};

