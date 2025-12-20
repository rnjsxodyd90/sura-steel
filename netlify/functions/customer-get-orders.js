// Get Customer Orders Function
// Fetches orders for a logged-in customer
// Requires Supabase auth token in the Authorization header

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  // Get the auth token from the request header
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized: Missing or invalid authorization header' }),
    };
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // First, verify the token and get the user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('User verification failed:', errorText);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      };
    }

    const user = await userResponse.json();
    const customerId = user.id;

    console.log('Fetching orders for customer:', customerId);

    // Fetch orders for this customer
    const ordersResponse = await fetch(
      `${supabaseUrl}/rest/v1/orders?customer_id=eq.${customerId}&order=created_at.desc`,
      {
        method: 'GET',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!ordersResponse.ok) {
      const errorText = await ordersResponse.text();
      console.error('Error fetching orders:', errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch orders' }),
      };
    }

    const orders = await ordersResponse.json();
    console.log(`Found ${orders.length} orders for customer ${customerId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orders: orders.map(order => ({
          id: order.id,
          order_number: order.order_number,
          total_amount: order.total_amount,
          currency: order.currency,
          status: order.status,
          items: order.items,
          shipping_address: order.shipping_address,
          tracking_number: order.tracking_number,
          created_at: order.created_at,
        })),
      }),
    };
  } catch (error) {
    console.error('Error in customer-get-orders:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
