// Get orders from Stripe for admin dashboard
// Requires STRIPE_SECRET_KEY and ADMIN_PASSWORD environment variables

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify admin authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || authHeader !== 'Bearer admin-authenticated') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Parse query parameters
    const params = event.queryStringParameters || {};
    const limit = parseInt(params.limit) || 50;
    const startingAfter = params.starting_after || undefined;

    // Fetch checkout sessions from Stripe (completed payments)
    const sessions = await stripe.checkout.sessions.list({
      limit,
      starting_after: startingAfter,
      expand: ['data.line_items', 'data.customer_details'],
    });

    // Transform sessions into order format
    const orders = sessions.data
      .filter(session => session.payment_status === 'paid')
      .map(session => ({
        id: session.id,
        created: session.created,
        amount_total: session.amount_total / 100, // Convert from cents
        currency: session.currency,
        status: session.payment_status,
        customer: {
          email: session.customer_details?.email || 'N/A',
          name: session.customer_details?.name || 'N/A',
          address: session.customer_details?.address || null,
        },
        items: session.line_items?.data?.map(item => ({
          name: item.description,
          quantity: item.quantity,
          amount: item.amount_total / 100,
        })) || [],
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        orders,
        has_more: sessions.has_more,
        next_cursor: sessions.data.length > 0 ? sessions.data[sessions.data.length - 1].id : null,
      }),
    };

  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch orders', details: error.message }),
    };
  }
};
