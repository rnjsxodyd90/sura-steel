const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { cart, customer_id, customer_email } = JSON.parse(event.body);

    // Validate cart
    if (!cart || cart.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Cart is empty' }),
      };
    }

    // Get the site URL from Netlify environment or use the origin
    const siteUrl = process.env.URL || 'https://surasteel.com';

    // Transform your cart items into Stripe's format
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name + (item.variant ? ` (${item.variant})` : ''),
          // Remove images for now - they can cause issues if not publicly accessible
          metadata: {
            product_id: item.id,
            variant: item.variant // Database variant name for inventory tracking
          }
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents (e.g., 20.00 -> 2000)
      },
      quantity: item.quantity,
    }));

    // Build session options
    const sessionOptions = {
      payment_method_types: ['card', 'ideal'], // Enable iDEAL for Netherlands
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}?success=true`,
      cancel_url: `${siteUrl}`,
      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: ['NL', 'BE', 'DE', 'FR', 'GB', 'AT', 'CH', 'IT', 'ES', 'PT', 'PL', 'DK', 'SE', 'NO', 'FI', 'IE', 'LU'],
      },
      // Store metadata for order creation
      metadata: {},
    };

    // If customer is logged in, store their ID in metadata
    if (customer_id) {
      sessionOptions.metadata.customer_id = customer_id;
    }

    // If we have the customer's email (logged in or provided), use it
    if (customer_email) {
      sessionOptions.customer_email = customer_email;
      if (!customer_id) {
        sessionOptions.metadata.guest_email = customer_email;
      }
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, details: error.toString() }),
    };
  }
};
