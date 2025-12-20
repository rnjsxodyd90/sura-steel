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
    // Support both new (publishable) and old (anon) key names
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase not configured - SUPABASE_URL or key missing');
      // Return empty array if Supabase not configured (frontend will treat as unlimited stock)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          inventory: [],
          message: 'Supabase not configured - all products show as available'
        }),
      };
    }

    // Fetch inventory from Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/inventory?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase API error:', response.status, errorText);
      throw new Error(`Failed to fetch inventory: ${response.status} ${errorText}`);
    }

    const inventory = await response.json();
    console.log(`Fetched ${inventory.length} inventory items`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ inventory }),
    };

  } catch (error) {
    console.error('Inventory fetch error:', error.message);
    // Return empty array on error so site still works
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        inventory: [],
        error: error.message,
        message: 'Inventory unavailable - showing all products as available'
      }),
    };
  }
};

