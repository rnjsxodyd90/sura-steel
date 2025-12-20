// Get sales analytics from Stripe for admin dashboard
// Requires STRIPE_SECRET_KEY environment variable

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

    // Parse query parameters for date range
    const params = event.queryStringParameters || {};
    const days = parseInt(params.days) || 30;

    // Calculate date range
    const now = Math.floor(Date.now() / 1000);
    const startDate = now - (days * 24 * 60 * 60);

    // Fetch all completed checkout sessions in date range
    let allSessions = [];
    let hasMore = true;
    let startingAfter = undefined;

    while (hasMore) {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        starting_after: startingAfter,
        created: { gte: startDate },
        expand: ['data.line_items'],
      });

      const paidSessions = sessions.data.filter(s => s.payment_status === 'paid');
      allSessions = [...allSessions, ...paidSessions];

      hasMore = sessions.has_more;
      if (sessions.data.length > 0) {
        startingAfter = sessions.data[sessions.data.length - 1].id;
      }

      // Safety limit to prevent infinite loops
      if (allSessions.length > 1000) break;
    }

    // Calculate analytics
    const totalRevenue = allSessions.reduce((sum, session) => sum + (session.amount_total || 0), 0) / 100;
    const orderCount = allSessions.length;
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Calculate popular products
    const productCounts = {};
    const productRevenue = {};

    allSessions.forEach(session => {
      if (session.line_items?.data) {
        session.line_items.data.forEach(item => {
          const name = item.description || 'Unknown Product';
          productCounts[name] = (productCounts[name] || 0) + item.quantity;
          productRevenue[name] = (productRevenue[name] || 0) + (item.amount_total / 100);
        });
      }
    });

    // Sort by quantity sold
    const popularProducts = Object.entries(productCounts)
      .map(([name, quantity]) => ({
        name,
        quantity,
        revenue: productRevenue[name] || 0,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Calculate daily revenue for chart
    const dailyRevenue = {};
    allSessions.forEach(session => {
      const date = new Date(session.created * 1000).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + (session.amount_total / 100);
    });

    // Fill in missing days with 0
    const revenueByDay = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      revenueByDay.push({
        date,
        revenue: dailyRevenue[date] || 0,
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        period: `${days} days`,
        totalRevenue,
        orderCount,
        averageOrderValue,
        popularProducts,
        revenueByDay,
      }),
    };

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch analytics', details: error.message }),
    };
  }
};
