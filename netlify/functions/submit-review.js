// Submit a product review

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
    const { product_id, customer_id, customer_name, rating, review_text } = JSON.parse(event.body);

    // Validate required fields
    if (!product_id || !customer_id || !rating || !review_text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Rating must be between 1 and 5' }),
      };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Check if user has purchased this product (verified purchase)
    const ordersResponse = await fetch(
      `${supabaseUrl}/rest/v1/orders?customer_id=eq.${customer_id}&select=items`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    let verifiedPurchase = false;
    if (ordersResponse.ok) {
      const orders = await ordersResponse.json();
      // Check if any order contains this product
      verifiedPurchase = orders.some(order =>
        order.items && order.items.some(item =>
          item.product_id === product_id || item.product_id === parseInt(product_id)
        )
      );
    }

    // Check if user already reviewed this product
    const existingReviewResponse = await fetch(
      `${supabaseUrl}/rest/v1/reviews?product_id=eq.${product_id}&customer_id=eq.${customer_id}&select=id`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (existingReviewResponse.ok) {
      const existingReviews = await existingReviewResponse.json();
      if (existingReviews.length > 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'You have already reviewed this product' }),
        };
      }
    }

    // Submit the review (auto-approved for now, can add moderation later)
    const reviewData = {
      product_id: parseInt(product_id),
      customer_id,
      customer_name: customer_name || 'Anonymous',
      rating,
      review_text: review_text.substring(0, 1000), // Limit review length
      verified_purchase: verifiedPurchase,
      status: 'approved', // Auto-approve for now
    };

    const submitResponse = await fetch(`${supabaseUrl}/rest/v1/reviews`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(reviewData),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Failed to submit review:', errorText);
      throw new Error('Failed to submit review');
    }

    const review = await submitResponse.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        review: review[0],
      }),
    };

  } catch (error) {
    console.error('Submit review error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to submit review' }),
    };
  }
};
