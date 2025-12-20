// Stripe Webhook Handler
// Handles successful payments, updates inventory, and creates orders
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
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product'],
        });

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

        if (supabaseUrl && supabaseServiceKey) {
          // Prepare order items for database
          const orderItems = [];

          for (const item of lineItems.data) {
            // Get product metadata from price object
            const price = await stripe.prices.retrieve(item.price.id);
            const productId = price.product_data?.metadata?.product_id;
            const variant = price.product_data?.metadata?.variant;

            // Add item to order items array
            orderItems.push({
              name: item.description,
              quantity: item.quantity,
              price: item.amount_total / 100, // Convert from cents
              product_id: productId ? parseInt(productId) : null,
              variant: variant || null,
            });

            // Update inventory if we have metadata
            if (productId && variant) {
              console.log(`Updating inventory: Product ${productId} - ${variant} x ${item.quantity}`);

              // Use RPC function for atomic decrement
              await fetch(`${supabaseUrl}/rest/v1/rpc/decrement_stock`, {
                method: 'POST',
                headers: {
                  'apikey': supabaseServiceKey,
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  p_product_id: parseInt(productId),
                  p_variant: variant,
                  p_quantity: item.quantity,
                }),
              });
            } else {
              console.warn(`Missing metadata for item: ${item.description}`);
            }
          }

          // Create the order in the database
          const customerId = session.metadata?.customer_id || null;
          const customerEmail = session.customer_details?.email || session.metadata?.guest_email || null;

          // Build shipping address from Stripe session
          const shippingAddress = session.shipping_details ? {
            name: session.shipping_details.name,
            address: session.shipping_details.address,
          } : (session.customer_details ? {
            name: session.customer_details.name,
            email: session.customer_details.email,
            address: session.customer_details.address,
          } : null);

          // Generate order number
          const orderNumber = 'SS-' +
            new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
            Math.random().toString(36).substring(2, 6).toUpperCase();

          const orderData = {
            stripe_session_id: session.id,
            customer_id: customerId,
            guest_email: customerId ? null : customerEmail,
            order_number: orderNumber,
            total_amount: session.amount_total / 100,
            currency: session.currency || 'eur',
            status: 'confirmed',
            shipping_address: shippingAddress,
            items: orderItems,
          };

          console.log('Creating order:', orderNumber);

          const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
            method: 'POST',
            headers: {
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation',
            },
            body: JSON.stringify(orderData),
          });

          if (orderResponse.ok) {
            const orderResult = await orderResponse.json();
            console.log('Order created successfully:', orderResult[0]?.id || orderNumber);
          } else {
            const errorText = await orderResponse.text();
            console.error('Failed to create order:', errorText);
            // Note: We don't fail the webhook if order creation fails
            // The payment was still successful
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
