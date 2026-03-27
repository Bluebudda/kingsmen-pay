import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();

    if (!email || !resetLink) {
      return new Response(
        JSON.stringify({ error: "Email and reset link are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailContent = {
      to: email,
      subject: "Reset Your Password - Kingsmen Pay",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #334155;
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 40px;
              border-radius: 16px 16px 0 0;
              text-align: center;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .content {
              background: white;
              padding: 40px;
              border-radius: 0 0 16px 16px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .greeting {
              font-size: 24px;
              font-weight: bold;
              color: #0f172a;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              opacity: 0.9;
            }
            .warning-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 20px;
              margin: 30px 0;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Kingsmen Pay</div>
              <p style="margin: 0; font-size: 18px;">Password Reset Request</p>
            </div>
            <div class="content">
              <div class="greeting">Reset Your Password</div>
              <p class="message">
                We received a request to reset your password for your Kingsmen Pay employee account.
              </p>

              <p class="message">
                Click the button below to reset your password:
              </p>

              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>

              <div class="warning-box">
                <strong>Security Notice:</strong><br>
                This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email or contact your system administrator.
              </div>

              <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
              </p>
            </div>

            <div class="footer">
              <p><strong>Kingsmen Pay</strong></p>
              <p>Employee Portal - Authorized Personnel Only</p>
              <p style="margin-top: 15px;">
                This is an automated security email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Reset Request - Kingsmen Pay

We received a request to reset your password for your Kingsmen Pay employee account.

To reset your password, click the following link:
${resetLink}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email or contact your system administrator.

---
Kingsmen Pay
Employee Portal - Authorized Personnel Only
      `.trim(),
    };

    console.log('Password reset email prepared:', {
      to: emailContent.to,
      subject: emailContent.subject,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password reset email sent',
        emailData: emailContent
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
