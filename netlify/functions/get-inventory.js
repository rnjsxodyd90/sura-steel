// Get inventory levels from Supabase
// Requires SUPABASE_URL and SUPABASE_ANON_KEY environment variables

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase not configured
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          inventory: [],
          message: 'Supabase not configured - using default stock levels'
        }),
      };
    }

    // Fetch inventory from Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/inventory?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inventory');
    }

    const inventory = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ inventory }),
    };

  } catch (error) {
    console.error('Inventory fetch error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch inventory' }),
    };
  }
};

