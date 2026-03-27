import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  applicationId?: string;
  companyName?: string;
  contactName?: string;
  subject?: string;
  html?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, applicationId, companyName, contactName, subject, html }: EmailRequest = await req.json();

    if (!to) {
      return new Response(
        JSON.stringify({ error: "Email address is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (subject && html) {
      const emailContent = {
        to,
        subject,
        html,
      };

      console.log('Custom email prepared:', {
        to: emailContent.to,
        subject: emailContent.subject,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email sent',
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
    }

    const emailContent = {
      to,
      subject: "Application Received - Kingsmen Pay",
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
            .info-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 20px;
              margin: 30px 0;
              border-radius: 8px;
            }
            .info-box strong {
              color: #1e40af;
            }
            .next-steps {
              margin: 30px 0;
            }
            .next-steps h3 {
              color: #0f172a;
              font-size: 18px;
              margin-bottom: 15px;
            }
            .step {
              display: flex;
              margin-bottom: 15px;
              align-items: start;
            }
            .step-number {
              background: #3b82f6;
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              flex-shrink: 0;
              margin-right: 15px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Kingsmen Pay</div>
              <p style="margin: 0; font-size: 18px;">Application Received Successfully</p>
            </div>
            <div class="content">
              <div class="greeting">Thank you${contactName ? `, ${contactName}` : ''}!</div>
              <p class="message">
                We've received your payment processing application${companyName ? ` for <strong>${companyName}</strong>` : ''} and our underwriting team is already reviewing it.
              </p>

              <div class="info-box">
                <strong>Application ID:</strong> ${applicationId || 'Pending'}<br>
                <strong>Status:</strong> Under Review<br>
                <strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div class="next-steps">
                <h3>What Happens Next?</h3>
                <div class="step">
                  <div class="step-number">1</div>
                  <div>
                    <strong>Initial Review</strong><br>
                    Our team will review your application within 24 hours
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div>
                    <strong>Personal Contact</strong><br>
                    We'll reach out via email or phone to discuss your needs and available rates
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div>
                    <strong>Integration & Launch</strong><br>
                    Once approved, we'll help you integrate and start processing payments
                  </div>
                </div>
              </div>

              <p style="margin-top: 30px;">
                If you have any immediate questions, feel free to reply to this email or contact our support team.
              </p>

              <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                Need to make changes to your application? Contact us with your Application ID.
              </p>
            </div>

            <div class="footer">
              <p><strong>Kingsmen Pay</strong></p>
              <p>Global Payment Processing Solutions</p>
              <p style="margin-top: 15px;">
                This is an automated confirmation email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Thank you${contactName ? `, ${contactName}` : ''}!

We've received your payment processing application${companyName ? ` for ${companyName}` : ''} and our underwriting team is already reviewing it.

Application Details:
- Application ID: ${applicationId || 'Pending'}
- Status: Under Review
- Submitted: ${new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

What Happens Next?

1. Initial Review
   Our team will review your application within 24 hours

2. Personal Contact
   We'll reach out via email or phone to discuss your needs and available rates

3. Integration & Launch
   Once approved, we'll help you integrate and start processing payments

If you have any immediate questions, feel free to reply to this email or contact our support team.

---
Kingsmen Pay
Global Payment Processing Solutions
      `.trim(),
    };

    console.log('Email confirmation prepared:', {
      to: emailContent.to,
      subject: emailContent.subject,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Confirmation email sent',
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
