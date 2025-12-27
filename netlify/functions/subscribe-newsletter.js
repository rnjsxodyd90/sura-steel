// Newsletter subscription handler
// Creates discount code and sends welcome email via Resend

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
    const { customer_id, email } = JSON.parse(event.body);

    if (!customer_id || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Customer ID and email are required' }),
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

    // Call the subscribe_newsletter RPC function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/subscribe_newsletter`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_customer_id: customer_id,
        p_email: email,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);

      // Check for already subscribed error
      if (errorText.includes('Already subscribed')) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'You are already subscribed to our newsletter' }),
        };
      }

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to subscribe to newsletter' }),
      };
    }

    const result = await response.json();
    const subscriptionData = result[0];

    if (!subscriptionData) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create subscription' }),
      };
    }

    const { discount_code, expires_at } = subscriptionData;

    // Format expiry date
    const expiryDate = new Date(expires_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send welcome email with discount code
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Sura Steel <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to Sura Steel - Your 15% Discount Code Inside!',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f4;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <div style="background-color: #1c1917; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #d97706; margin: 0; font-size: 28px; letter-spacing: 2px;">SURA STEEL</h1>
                    <p style="color: #a8a29e; margin: 10px 0 0 0; font-size: 14px;">Premium Korean Stainless Steel Cutlery</p>
                  </div>

                  <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1c1917; margin: 0 0 20px 0; font-size: 24px;">Welcome to the Family!</h2>

                    <p style="color: #44403c; line-height: 1.6; margin: 0 0 20px 0;">
                      Thank you for subscribing to the Sura Steel newsletter. We're excited to have you join our community of design enthusiasts who appreciate quality craftsmanship.
                    </p>

                    <p style="color: #44403c; line-height: 1.6; margin: 0 0 30px 0;">
                      As a thank you, here's your exclusive discount code:
                    </p>

                    <div style="background-color: #fef3c7; border: 2px dashed #d97706; padding: 25px; text-align: center; margin: 0 0 30px 0; border-radius: 8px;">
                      <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Discount Code</p>
                      <p style="color: #1c1917; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 3px;">${discount_code}</p>
                      <p style="color: #d97706; margin: 15px 0 0 0; font-size: 20px; font-weight: bold;">15% OFF</p>
                    </div>

                    <div style="background-color: #f5f5f4; padding: 20px; border-radius: 8px; margin: 0 0 30px 0;">
                      <p style="color: #78716c; margin: 0; font-size: 14px; line-height: 1.8;">
                        <strong style="color: #1c1917;">Important:</strong><br>
                        &#8226; Valid until: ${expiryDate}<br>
                        &#8226; Single use only<br>
                        &#8226; Linked to your account
                      </p>
                    </div>

                    <div style="text-align: center;">
                      <a href="https://surasteel.com" style="display: inline-block; background-color: #d97706; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Shop Now</a>
                    </div>
                  </div>

                  <div style="text-align: center; padding: 30px 20px;">
                    <p style="color: #a8a29e; font-size: 12px; margin: 0;">
                      Sura Steel | The Hague, Netherlands<br>
                      <a href="https://surasteel.com" style="color: #d97706;">surasteel.com</a>
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const emailError = await emailResponse.json();
          console.error('Resend API error:', emailError);
        } else {
          console.log('Welcome email sent successfully to:', email);
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails - subscription was still created
      }
    } else {
      console.log('RESEND_API_KEY not configured. Discount code:', discount_code);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed to newsletter! Check your email for your discount code.',
        discount_code: discount_code,
        expires_at: expires_at,
      }),
    };

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process subscription' }),
    };
  }
};
