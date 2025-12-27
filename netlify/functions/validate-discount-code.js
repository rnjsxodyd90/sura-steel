// Validate discount code for checkout
// Checks if code is valid, not expired, not used, and belongs to customer

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { code, customer_id } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Discount code is required' }),
      };
    }

    if (!customer_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'You must be logged in to use a discount code' }),
      };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Call the validate_discount_code RPC function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/validate_discount_code`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_code: code.toUpperCase().trim(),
        p_customer_id: customer_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to validate discount code' }),
      };
    }

    const result = await response.json();
    const validation = result[0];

    if (!validation) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          valid: false,
          error: 'Invalid discount code'
        }),
      };
    }

    if (!validation.is_valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          valid: false,
          error: validation.error_message || 'Invalid discount code'
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        discount_percent: validation.discount_percent,
        code: code.toUpperCase().trim(),
        message: `${validation.discount_percent}% discount applied!`,
      }),
    };

  } catch (error) {
    console.error('Discount validation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to validate discount code' }),
    };
  }
};
