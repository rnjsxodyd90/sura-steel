// Create Order Function
// Called from the Stripe webhook after successful payment
// Creates an order record in Supabase, linked to customer if logged in

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
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

  try {
    const {
      stripe_session_id,
      customer_id,
      guest_email,
      total_amount,
      currency,
      shipping_address,
      items,
    } = JSON.parse(event.body);

    // Validate required fields
    if (!stripe_session_id || !items || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: stripe_session_id, items' }),
      };
    }

    // Call the RPC function to create the order
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_order`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        p_stripe_session_id: stripe_session_id,
        p_customer_id: customer_id || null,
        p_guest_email: guest_email || null,
        p_total_amount: total_amount || 0,
        p_currency: currency || 'eur',
        p_shipping_address: shipping_address || null,
        p_items: items,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase RPC error:', errorText);

      // If RPC function doesn't exist, fall back to direct insert
      if (errorText.includes('function') || errorText.includes('not exist')) {
        console.log('RPC function not found, using direct insert...');
        return await createOrderDirectly({
          supabaseUrl,
          supabaseServiceKey,
          stripe_session_id,
          customer_id,
          guest_email,
          total_amount,
          currency,
          shipping_address,
          items,
          headers,
        });
      }

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create order', details: errorText }),
      };
    }

    const result = await response.json();
    console.log('Order created via RPC:', result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        order_id: result[0]?.order_id,
        order_number: result[0]?.order_number,
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

// Fallback function to create order directly if RPC doesn't exist
async function createOrderDirectly(params) {
  const {
    supabaseUrl,
    supabaseServiceKey,
    stripe_session_id,
    customer_id,
    guest_email,
    total_amount,
    currency,
    shipping_address,
    items,
    headers,
  } = params;

  // Generate a simple order number
  const orderNumber = 'SS-' +
    new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
    Math.random().toString(36).substring(2, 6).toUpperCase();

  const orderData = {
    stripe_session_id,
    customer_id: customer_id || null,
    guest_email: guest_email || null,
    order_number: orderNumber,
    total_amount: total_amount || 0,
    currency: currency || 'eur',
    status: 'confirmed',
    shipping_address: shipping_address || null,
    items: items,
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Direct insert error:', errorText);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create order', details: errorText }),
    };
  }

  const result = await response.json();
  console.log('Order created directly:', result);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      order_id: result[0]?.id,
      order_number: result[0]?.order_number || orderNumber,
    }),
  };
}
