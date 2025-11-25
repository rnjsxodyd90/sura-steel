const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { cart } = JSON.parse(event.body);

    // Transform your cart items into Stripe's format
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name + (item.variant ? ` (${item.variant})` : ''),
          images: [`https://surasteel.com${item.image}`], // Must be a live URL
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents (e.g., 20.00 -> 2000)
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'], // Enable iDEAL for Netherlands
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};