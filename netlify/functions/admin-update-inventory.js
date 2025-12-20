// Update inventory levels from admin dashboard
// Requires SUPABASE_URL, SUPABASE_SERVICE_KEY environment variables

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST' && event.httpMethod !== 'PUT') {
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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Supabase not configured' }),
      };
    }

    const { product_id, variant, stock } = JSON.parse(event.body);

    if (product_id === undefined || !variant || stock === undefined) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'product_id, variant, and stock are required' }),
      };
    }

    // Check if inventory record exists
    const checkResponse = await fetch(
      `${supabaseUrl}/rest/v1/inventory?product_id=eq.${product_id}&variant=eq.${variant}`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const existingRecords = await checkResponse.json();

    if (existingRecords && existingRecords.length > 0) {
      // Update existing record
      const updateResponse = await fetch(
        `${supabaseUrl}/rest/v1/inventory?product_id=eq.${product_id}&variant=eq.${variant}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({ stock: parseInt(stock) }),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update inventory: ${errorText}`);
      }

      const updated = await updateResponse.json();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, inventory: updated[0] }),
      };
    } else {
      // Insert new record
      const insertResponse = await fetch(
        `${supabaseUrl}/rest/v1/inventory`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            product_id: parseInt(product_id),
            variant,
            stock: parseInt(stock),
          }),
        }
      );

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        throw new Error(`Failed to create inventory: ${errorText}`);
      }

      const inserted = await insertResponse.json();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, inventory: inserted[0] }),
      };
    }

  } catch (error) {
    console.error('Inventory update error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update inventory', details: error.message }),
    };
  }
};
