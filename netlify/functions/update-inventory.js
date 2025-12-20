// Update inventory after successful purchase
// Called by Stripe webhook or after checkout
// Requires SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase not configured - skipping inventory update');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Supabase not configured' }),
      };
    }

    const { items } = JSON.parse(event.body);

    if (!items || !Array.isArray(items)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Items array required' }),
      };
    }

    // Update each item's stock
    for (const item of items) {
      const { product_id, variant, quantity } = item;

      // Decrement stock using Supabase RPC or direct update
      const response = await fetch(
        `${supabaseUrl}/rest/v1/rpc/decrement_stock`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            p_product_id: product_id,
            p_variant: variant,
            p_quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to update stock for product ${product_id}`);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Inventory updated' }),
    };

  } catch (error) {
    console.error('Inventory update error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update inventory' }),
    };
  }
};

