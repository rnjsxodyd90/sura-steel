// Get reviews for a product

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const productId = event.queryStringParameters?.product_id;

    if (!productId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Product ID is required' }),
      };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ reviews: [], average_rating: 0, total_reviews: 0 }),
      };
    }

    // Get approved reviews for the product
    const response = await fetch(
      `${supabaseUrl}/rest/v1/reviews?product_id=eq.${productId}&status=eq.approved&select=id,rating,review_text,customer_name,verified_purchase,created_at&order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const reviews = await response.json();

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reviews,
        average_rating: Math.round(averageRating * 10) / 10,
        total_reviews: totalReviews,
      }),
    };

  } catch (error) {
    console.error('Get reviews error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch reviews' }),
    };
  }
};
