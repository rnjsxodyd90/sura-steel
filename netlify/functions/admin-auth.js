// Simple admin authentication
// In production, use Supabase Auth or another proper auth system
// Requires ADMIN_PASSWORD environment variable

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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { password } = JSON.parse(event.body);
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Admin password not configured' }),
      };
    }

    if (password === adminPassword) {
      // In production, return a JWT token instead
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          token: 'admin-authenticated' // Simple token for MVP
        }),
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid password' }),
      };
    }

  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Authentication failed' }),
    };
  }
};
